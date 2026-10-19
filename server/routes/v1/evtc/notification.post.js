import { DatabaseUnavailableError, getCollection } from '../../../utils/database'

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
const METADATA_URL = process.env.DPSREPORT_METADATA_URL
  || 'https://dps.report/getUploadMetadata'
const MAX_URL_LENGTH = 2083

// Ends the request early with this status and body
class Reply extends Error {
  constructor (status, body) {
    super(`HTTP ${status}`)
    this.status = status
    this.body = body
  }
}

function isHttpUrl (value) {
  if (
    typeof value !== 'string'
    || value.length < 1
    || value.length > MAX_URL_LENGTH
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

// JSON bodies only, objects or arrays, reported the way FastAPI's
// validation errors were. Other content types are treated as empty.
async function readJsonBody (event) {
  const contentType = getRequestHeader(event, 'content-type') || ''

  if (!/^application\/json\s*(;|$)/i.test(contentType)) {
    return {}
  }

  const raw = (await readRawBody(event, 'utf8'))?.trim()

  if (!raw) {
    return {}
  }

  try {
    if (!['{', '['].includes(raw[0])) {
      throw new SyntaxError(`Unexpected token ${raw[0]} in JSON at position 0`)
    }
    return JSON.parse(raw)
  } catch (error) {
    throw new Reply(422, {
      detail: [{ loc: ['body'], msg: error.message, type: 'value_error.jsondecode' }]
    })
  }
}

// Resolves the Bearer API key to its user's Discord ID
async function authenticate (event) {
  const header = getRequestHeader(event, 'authorization')

  if (!header) {
    throw new Reply(403, { detail: 'Not authenticated' })
  }

  if (!header.toLowerCase().startsWith('bearer ')) {
    throw new Reply(400, {
      detail: 'Invalid authentication value. Schema must be defined as Bearer .'
    })
  }

  const apiKeys = await getCollection('evtc.api_keys')
  const apiKey = await apiKeys.findOne({ token: header.slice(7) })

  if (!apiKey) {
    throw new Reply(401, { detail: 'Invalid API key' })
  }

  return apiKey.user
}

async function createNotification (event) {
  const body = await readJsonBody(event)
  const userID = await authenticate(event)
  const permalink = body?.dpsreport_url

  if (!isHttpUrl(permalink)) {
    throw new Reply(422, {
      detail: [{
        loc: ['body', 'dpsreport_url'],
        msg: 'invalid or missing URL',
        type: 'value_error.url'
      }]
    })
  }

  const notifications = await getCollection('evtc.notifications')

  if (await notifications.findOne({ permalink, user_id: userID })) {
    throw new Reply(409, { detail: 'Notification already exists' })
  }

  if (!REPORT_BASE_URLS.some(baseUrl => permalink.startsWith(baseUrl))) {
    throw new Reply(400, { detail: 'The provided url is invalid.' })
  }

  let metadata

  try {
    const response = await fetch(
      `${METADATA_URL}?${new URLSearchParams({ permalink })}`,
      { signal: AbortSignal.timeout(10000) }
    )

    if (!response.ok) {
      throw new Reply(400, { detail: 'Invalid URL' })
    }

    metadata = await response.json()
  } catch (error) {
    if (error instanceof Reply) { throw error }
    console.error(`dps.report metadata request failed for ${permalink}`, error)
    throw new Reply(502, { detail: 'Failed to reach dps.report' })
  }

  await notifications.insertOne({
    user_id: userID,
    permalink,
    encounter_id: metadata.id,
    posted: false
  })

  return new Reply(201, { detail: 'Successfully created' })
}

export default defineEventHandler(async (event) => {
  let reply

  try {
    reply = await createNotification(event)
  } catch (error) {
    if (error instanceof Reply) {
      reply = error
    } else if (error instanceof DatabaseUnavailableError) {
      reply = new Reply(504, { message: 'Gateway Timeout', cause: error.message })
    } else {
      console.error(error)
      reply = new Reply(500, { detail: 'Internal Server Error' })
    }
  }

  setResponseStatus(event, reply.status)
  return reply.body
})
