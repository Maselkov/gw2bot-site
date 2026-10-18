/* eslint-disable no-console */
import { Long } from 'mongodb'

import * as database from './database'

/*
 * Authentication middleware for API routes.
 * "userID" cookie matches user id (Discord ID)
 * "token" cookie matches user dpsreport_token
*/
export async function authenticate (req, res, next) {
  const errors = []

  const userID = req.cookies.userID

  if (!userID || isNaN(userID)) {
    errors.push('Invalid user ID')
  }

  if (!req.cookies.accountName) {
    errors.push('Invalid account name')
  }

  const dpsToken = req.cookies.dpsToken

  if (!dpsToken) {
    errors.push('Invalid token')
  }

  if (errors.length > 0) {
    console.error(
      `Authenication failed for user <@${userID}> (Token: "${dpsToken}")`
    )
    res.status(400).send({
      message: 'Bad Request',
      cause: errors.join('.\n')
    })
    return
  }

  const user = await database.getUser(new Long(userID), res)

  if (user === 0) { return }

  if (dpsToken !== user.dpsreport_token) {
    res.status(400).send({
      message: 'Bad Request',
      cause: 'Invalid token'
    })
    return
  }

  next()
}
