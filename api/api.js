/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fetch from 'node-fetch'
import { Long, ObjectId } from 'mongodb'

import bosses from '../assets/js/bossesData'

import * as database from './database'
import { authenticate } from './authenticate'
import { generateEncounters } from './generateEncounters'
import { encounterSchema } from './encounterSchema'
import { validateSchema } from './validateSchema'

const server = express()

server.disable('x-powered-by')

server.use(
  cors({
    ...(process.env.NODE_ENV === 'production' && {
      origin: /https:\/\/(www\.)?gw2bot\.info/
    })
  })
)

server.use(cookieParser())

server.use('/encounters', authenticate)

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict'
}

const encounterData = {}
const encounterLookup = {}
const encounterTally = { total: 0 }

for (const [category, instances] of Object.entries(bosses)) {
  encounterTally[category] = 0

  for (const [instance, encounters] of Object.entries(instances)) {
    encounterTally[instance] = 0

    for (const encounter of encounters) {
      encounterLookup[encounter.api_name] = encounter.ids
      encounterTally[encounter.name] = 0

      for (const id of encounter.ids) {
        encounterData[id] = {
          category,
          instance,
          encounter: encounter.name,
          count: 0
        }
      }
    }
  }
}

server.get('/user', async (req, res) => {
  const discordToken = req.header('Authorization')

  if (!discordToken) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  // Check if user has previously authenticated
  if (req.cookies.userID && req.cookies.accountName && req.cookies.dpsToken) {
    const user = await database.getUser(new Long(req.cookies.userID), res)

    if (user === 0) { return }

    // Clear stale cookies
    if (
      req.cookies.accountName !== user.key.account_name ||
      req.cookies.dpsToken !== user.dpsreport_token
    ) {
      res.clearCookie('userID', cookieOptions)
        .clearCookie('accountName', cookieOptions)
        .clearCookie('dpsToken', cookieOptions)
        .status(409).send({
          message: 'Conflict',
          cause: 'Try refreshing the page or clearing your cookies'
        })
      return
    }

    res.send(user.key.account_name)
    return
  }

  const discordUser = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: discordToken
    }
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }

    console.error(
      `Discord API Error ${response.status}.\n(Token: "${discordToken}")`
    )
    res.status(response.status).send({ message: response.statusText })
    return 0
  })

  if (discordUser === 0) { return }

  const userID = new Long(discordUser.id)
  const user = await database.getUser(userID, res)

  if (user === 0) { return }

  if (!userID.equals(user._id)) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  // accountName is from user's active API key (changes with /key switch)
  const accountName = user.key.account_name
  const dpsToken = user.dpsreport_token

  res.cookie('userID', discordUser.id, cookieOptions)
    .cookie('accountName', accountName, cookieOptions)
    .cookie('dpsToken', dpsToken, cookieOptions)
    .send(accountName)
})

server.get('/encounters', async (req, res) => {
  const encounters = await database.getCollection('encounters', res)

  if (encounters === 0) { return }

  try {
    const userEncounterData = JSON.parse(JSON.stringify(encounterData))

    await encounters.find({
      players: req.cookies.accountName
    }, {
      projection: {
        boss_id: 1
      }
    }).forEach((doc) => {
      if (userEncounterData[doc.boss_id]) {
        userEncounterData[doc.boss_id].count++
      } else {
        console.error(
          `Unknown boss ID: "${doc.boss_id}" (encounter ID: "${doc._id}")`
        )
      }
    })

    const userEncounterTally = JSON.parse(JSON.stringify(encounterTally))

    for (const boss of Object.values(userEncounterData)) {
      userEncounterTally.total += boss.count
      userEncounterTally[boss.category] += boss.count
      userEncounterTally[boss.instance] += boss.count
      if (boss.encounter === boss.instance) { continue }
      userEncounterTally[boss.encounter] += boss.count
    }

    res.send(userEncounterTally)
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: 'Internal Server Error' })
  }
})

server.get('/encounters/:name', async (req, res) => {
  const encounterIds = encounterLookup[req.params.name]

  if (!encounterIds) {
    res.status(400).send({
      message: 'Bad Request',
      cause: 'Invalid encounter name'
    })
    return
  }

  const encounters = await database.getCollection('encounters', res)

  if (encounters === 0) { return }

  const userEncounters = await encounters.find({
    players: req.cookies.accountName,
    boss_id: {
      $in: encounterIds
    }
  }, {
    projection: {
      start_date: 0,
      players: 0
    },
    sort: [
      ['date', -1]
    ]
  }).toArray()

  res.send(userEncounters)
})

if (process.env.NODE_ENV === 'development') {
  server.get('/encounters_test', async (req, res) => {
    const count = Math.min(Math.max(req.query.count, 1), 150)

    if (!count) {
      console.error(`Invalid encounter count: "${req.query.count}"`)
      res.status(400).send({
        message: 'Bad Request',
        cause: 'Invalid encounter count.\nSet "count" query to integer'
      })
      return
    }

    const encounters = await database.getCollection('encounters_test', res)

    if (encounters === 0) { return }

    const documentCount = await encounters.countDocuments()

    if (documentCount !== count) {
      try {
        await encounters.drop()
      } catch (error) {
        console.error(error)
      }

      const result = await encounters.bulkWrite(
        generateEncounters(count, req.cookies.accountName)
      )

      if (result.ok) {
        console.log(`Generated ${result.nInserted} test encounters`)
      } else {
        res.status(500).send({ message: 'Internal Server Error' })
        return
      }
    }

    const userEncounterTally = JSON.parse(JSON.stringify(encounterTally))

    userEncounterTally.total = userEncounterTally['World vs World'] = count

    res.send(userEncounterTally)
  })

  server.get('/encounters_test/:name', async (req, res) => {
    const encounterIds = encounterLookup[req.params.name]

    if (!encounterIds) {
      res.status(400).send({
        message: 'Bad Request',
        cause: 'Invalid encounter name'
      })
      return
    }

    const encounters = await database.getCollection('encounters_test', res)

    if (encounters === 0) { return }

    const userEncounters = await encounters.find({}, {
      sort: [
        ['date', -1]
      ]
    }).toArray()

    res.send(userEncounters)
  })
}

server.post('/encounters/:id', express.json(), async (req, res) => {
  const encounterId = new ObjectId(req.params.id)

  const validationResult = validateSchema(req.body, encounterSchema)

  if (validationResult === 0) {
    res.status(400).send({ message: 'Bad Request' })
    return
  }

  const encounters = await database.getCollection('encounters', res)

  if (encounters === 0) { return }

  try {
    await encounters.updateOne({ _id: encounterId }, {
      $set: {
        details: req.body
      }
    })

    res.send('Success')
  } catch (error) {
    console.error(`Error adding details to encounter "${req.params.id}"`)
    res.send('Failure')
  }
})

export default {
  path: '/api',
  handler: server
}
