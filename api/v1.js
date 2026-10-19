/* eslint-disable no-console */
import express from 'express'
import fetch from 'node-fetch'

import * as database from './database'

/*
 * Public API for third-party log uploaders such as PlenBot, served at
 * api.gw2bot.info/v1. Ported from the old FastAPI service, so status codes
 * and the {"detail": ...} response bodies match what clients already handle.
 *
 * POST /v1/evtc/notification queues a dps.report log for GW2Bot to post to
 * the user's EVTC destinations. Users get their API key from
 * /evtc api_key generate in Discord.
 */

const REPORT_BASE_URLS = ['https://dps.report/', 'https://wvw.report/']
const METADATA_URL = process.env.DPSREPORT_METADATA_URL ||
  'https://dps.report/getUploadMetadata'
const MAX_URL_LENGTH = 2083

const server = express()

server.disable('x-powered-by')

server.use(express.json())

function isHttpUrl (value) {
  if (
    typeof value !== 'string' ||
    value.length < 1 ||
    value.length > MAX_URL_LENGTH
  ) {
    return false
  }

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && url.hostname !== ''
  } catch {
    return false
  }
}

// Express 4 doesn't catch rejected promises, so pass them to the error handler
function catchErrors (handler) {
  return (req, res, next) => handler(req, res, next).catch(next)
}

// Resolves the Bearer API key to its user's Discord ID
const authenticate = catchErrors(async (req, res, next) => {
  const header = req.header('Authorization')

  if (!header) {
    res.status(403).send({ detail: 'Not authenticated' })
    return
  }

  if (!header.toLowerCase().startsWith('bearer ')) {
    res.status(400).send({
      detail: 'Invalid authentication value. Schema must be defined as Bearer .'
    })
    return
  }

  const apiKeys = await database.getCollection('evtc.api_keys', res)

  if (apiKeys === 0) { return }

  const apiKey = await apiKeys.findOne({ token: header.slice(7) })

  if (!apiKey) {
    res.status(401).send({ detail: 'Invalid API key' })
    return
  }

  req.userID = apiKey.user
  next()
})

server.post('/evtc/notification', authenticate, catchErrors(async (req, res) => {
  const permalink = req.body?.dpsreport_url

  if (!isHttpUrl(permalink)) {
    res.status(422).send({
      detail: [{
        loc: ['body', 'dpsreport_url'],
        msg: 'invalid or missing URL',
        type: 'value_error.url'
      }]
    })
    return
  }

  const notifications = await database.getCollection('evtc.notifications', res)

  if (notifications === 0) { return }

  if (await notifications.findOne({ permalink, user_id: req.userID })) {
    res.status(409).send({ detail: 'Notification already exists' })
    return
  }

  if (!REPORT_BASE_URLS.some(baseUrl => permalink.startsWith(baseUrl))) {
    res.status(400).send({ detail: 'The provided url is invalid.' })
    return
  }

  let metadata

  try {
    const response = await fetch(
      `${METADATA_URL}?${new URLSearchParams({ permalink })}`,
      { signal: AbortSignal.timeout(10000) }
    )

    if (!response.ok) {
      res.status(400).send({ detail: 'Invalid URL' })
      return
    }

    metadata = await response.json()
  } catch (error) {
    console.error(`dps.report metadata request failed for ${permalink}`, error)
    res.status(502).send({ detail: 'Failed to reach dps.report' })
    return
  }

  await notifications.insertOne({
    user_id: req.userID,
    permalink,
    encounter_id: metadata.id,
    posted: false
  })

  res.status(201).send({ detail: 'Successfully created' })
}))

// Malformed JSON bodies, reported the way FastAPI's validation errors were
server.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    res.status(422).send({
      detail: [{ loc: ['body'], msg: error.message, type: 'value_error.jsondecode' }]
    })
    return
  }

  console.error(error)
  res.status(500).send({ detail: 'Internal Server Error' })
})

export default {
  path: '/v1',
  handler: server
}
