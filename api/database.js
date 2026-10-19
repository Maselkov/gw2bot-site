/* eslint-disable no-console */
import { MongoClient } from 'mongodb'

export const client = new MongoClient(
  `mongodb://${
    process.env.MONGO_HOST || 'localhost'
  }:${
    process.env.MONGO_PORT || '27017'
  }`
)

export async function getCollection (collection, res) {
  try {
    await client.connect()
  } catch (error) {
    console.error(error)
    res.status(504).send({
      message: 'Gateway Timeout',
      cause: `Failed to connect to database:\n${error.message}`
    })
    return 0
  }

  return client.db(process.env.MONGO_DB || 'gw2bot').collection(collection)
}
