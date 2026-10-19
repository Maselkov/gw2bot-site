/*
 * Contract tests for POST /v1/evtc/notification. Third-party uploaders such
 * as PlenBot rely on these status codes and {"detail": ...} bodies, so they
 * must not change. Runs against a live site (see docker-compose.test.yml),
 * with dps.report replaced by a local stub.
 */
import { after, before, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'

import { MongoClient } from 'mongodb'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3999'
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27018'
const MONGO_DB = process.env.MONGO_DB || 'gw2bot_test'
const STUB_PORT = Number(process.env.STUB_PORT || 4010)

const ENDPOINT = `${BASE_URL}/v1/evtc/notification`
const TOKEN = randomUUID()
const USER_ID = Math.floor(Math.random() * 1e15)

let mongo, db, stub

// dps.report's getUploadMetadata, steered by the permalink being looked up
function stubHandler (req, res) {
  const permalink = new URL(req.url, 'http://stub').searchParams.get('permalink')

  if (permalink.includes('missing')) {
    res.writeHead(404).end()
  } else if (permalink.includes('unreachable')) {
    req.socket.destroy()
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ id: `stub-${permalink.split('/').pop()}` }))
  }
}

function post (body, { auth = `Bearer ${TOKEN}`, raw = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth !== null) { headers.Authorization = auth }

  return fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: raw ? body : JSON.stringify(body)
  })
}

async function expectResponse (response, status, detail) {
  assert.equal(response.status, status)
  const body = await response.json()
  if (detail !== undefined) {
    assert.deepEqual(body, { detail })
  }
  return body
}

const permalink = slug => `https://dps.report/${slug}-${randomUUID()}`

before(async () => {
  stub = createServer(stubHandler)
  await new Promise(resolve => stub.listen(STUB_PORT, '0.0.0.0', resolve))

  mongo = await MongoClient.connect(MONGO_URL)
  db = mongo.db(MONGO_DB)
  await db.collection('evtc.api_keys').insertOne({ token: TOKEN, user: USER_ID })
})

after(async () => {
  await db.collection('evtc.api_keys').deleteMany({ token: TOKEN })
  await db.collection('evtc.notifications').deleteMany({ user_id: USER_ID })
  await mongo.close()
  stub.closeAllConnections()
  await new Promise(resolve => stub.close(resolve))
})

describe('authentication', () => {
  test('403 without an Authorization header', async () => {
    await expectResponse(
      await post({ dpsreport_url: permalink('a') }, { auth: null }),
      403, 'Not authenticated'
    )
  })

  test('400 for a non-Bearer scheme', async () => {
    await expectResponse(
      await post({ dpsreport_url: permalink('a') }, { auth: `Basic ${TOKEN}` }),
      400, 'Invalid authentication value. Schema must be defined as Bearer .'
    )
  })

  test('401 for an unknown API key', async () => {
    await expectResponse(
      await post({ dpsreport_url: permalink('a') }, { auth: `Bearer ${randomUUID()}` }),
      401, 'Invalid API key'
    )
  })

  test('the Bearer scheme is case-insensitive', async () => {
    await expectResponse(
      await post({ dpsreport_url: permalink('case') }, { auth: `bearer ${TOKEN}` }),
      201, 'Successfully created'
    )
  })
})

describe('validation', () => {
  for (const [name, body] of [
    ['missing', {}],
    ['not a string', { dpsreport_url: 42 }],
    ['not a URL', { dpsreport_url: 'dps.report/abc' }],
    ['not http(s)', { dpsreport_url: 'ftp://dps.report/abc' }],
    ['too long', { dpsreport_url: `https://dps.report/${'a'.repeat(2100)}` }]
  ]) {
    test(`422 when dpsreport_url is ${name}`, async () => {
      await expectResponse(await post(body), 422, [{
        loc: ['body', 'dpsreport_url'],
        msg: 'invalid or missing URL',
        type: 'value_error.url'
      }])
    })
  }

  test('422 for malformed JSON', async () => {
    const body = await expectResponse(await post('{"dpsreport_url":', { raw: true }), 422)
    assert.equal(body.detail.length, 1)
    assert.deepEqual(body.detail[0].loc, ['body'])
    assert.equal(body.detail[0].type, 'value_error.jsondecode')
    assert.equal(typeof body.detail[0].msg, 'string')
  })

  test('400 for a URL outside dps.report and wvw.report', async () => {
    await expectResponse(
      await post({ dpsreport_url: 'https://example.com/abc' }),
      400, 'The provided url is invalid.'
    )
  })
})

describe('dps.report metadata', () => {
  test('400 when dps.report does not know the log', async () => {
    await expectResponse(
      await post({ dpsreport_url: permalink('missing') }),
      400, 'Invalid URL'
    )
  })

  test('502 when dps.report cannot be reached', async () => {
    await expectResponse(
      await post({ dpsreport_url: permalink('unreachable') }),
      502, 'Failed to reach dps.report'
    )
  })
})

describe('notifications', () => {
  const url = permalink('success')

  test('201 queues the notification', async () => {
    await expectResponse(await post({ dpsreport_url: url }), 201, 'Successfully created')

    const notification = await db.collection('evtc.notifications')
      .findOne({ permalink: url }, { projection: { _id: 0 } })

    assert.deepEqual(notification, {
      user_id: USER_ID,
      permalink: url,
      encounter_id: `stub-${url.split('/').pop()}`,
      posted: false
    })
  })

  test('409 for a log that is already queued', async () => {
    await expectResponse(
      await post({ dpsreport_url: url }),
      409, 'Notification already exists'
    )
  })

  test('wvw.report logs are accepted', async () => {
    await expectResponse(
      await post({ dpsreport_url: `https://wvw.report/${randomUUID()}` }),
      201, 'Successfully created'
    )
  })
})
