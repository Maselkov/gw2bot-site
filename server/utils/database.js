import { MongoClient } from 'mongodb'

export const mongoClient = new MongoClient(
  `mongodb://${
    process.env.MONGO_HOST || 'localhost'
  }:${
    process.env.MONGO_PORT || '27017'
  }`
)

export class DatabaseUnavailableError extends Error {}

export async function getCollection (collection) {
  try {
    await mongoClient.connect()
  } catch (error) {
    console.error(error)
    throw new DatabaseUnavailableError(`Failed to connect to database:\n${error.message}`)
  }

  return mongoClient.db(process.env.MONGO_DB || 'gw2bot').collection(collection)
}
