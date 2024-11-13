"use server"

import { getCollection } from "../lib/db.js"
import bcrypt from "bcrypt"
import { cookies } from "next/headers.js"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

const isAlphaNumeric = function (x) {
  const regex = /^[a-zA-Z0-9]*$/
  return regex.test(x)
}

export const login = async function (prevState, formData) {
  const failObject = {
    success: false,
    message: "Invalid username / password"
  }

  const ourUser = {
    username: formData.get("username"),
    password: formData.get("password")
  }

  if (typeof ourUser.username !== "string") ourUser.username = ""
  if (typeof ourUser.password !== "string") ourUser.password = ""

  const collection = await getCollection("users")
  const user = await collection.findOne({ username: ourUser.username })

  if (!user) {
    return failObject
  }

  const matchOrNot = bcrypt.compareSync(ourUser.password, user.password)

  if (!matchOrNot) {
    return failObject
  }

  // create jwt value
  const ourTokenValue = jwt.sign(
    {
      skyColor: "blue",
      userId: user._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    },
    process.env.JWTSECRET
  )

  // log user in by giving them a cookie
  cookies().set("ourhaikuapp", ourTokenValue, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    secure: true
  })

  return redirect("/")
}

export const logout = async function () {
  await cookies().delete("ourhaikuapp")
  redirect("/")
}

export const register = async function (prevState, formData) {
  const errors = {}

  const ourUser = {
    username: formData.get("username"),
    password: formData.get("password")
  }

  if (typeof ourUser.username !== "string") ourUser.username = ""
  if (typeof ourUser.password !== "string") ourUser.password = ""

  ourUser.username = ourUser.username.trim()
  ourUser.password = ourUser.password.trim()

  if (ourUser.username.length < 3) errors.username = "Username must be at least 3 characters."
  if (ourUser.username.length > 30) errors.username = "Username cannot exceed 30 characters."
  if (!isAlphaNumeric(ourUser.username)) errors.username = "Username must consist of letters and numbers."
  if (ourUser.username == "") errors.username = "Username cannot be empty."

  // see if username already exists
  const usersCollection = await getCollection("users")
  const usernameCheck = await usersCollection.findOne({ username: ourUser.username })

  if (usernameCheck) {
    errors.username = "Username already exists."
  }

  if (ourUser.password.length < 8) errors.password = "Password must be at least 3 characters."
  if (ourUser.password.length > 50) errors.password = "Password cannot exceed 30 characters."
  if (!isAlphaNumeric(ourUser.password)) errors.password = "Password must consist of letters and numbers."
  if (ourUser.password == "") errors.password = "Password cannot be empty."

  if (errors.username || errors.password) return { errors: errors, success: false }

  // hash password first
  const salt = bcrypt.genSaltSync(10)
  ourUser.password = bcrypt.hashSync(ourUser.password, salt)

  // storing user in database
  const newUser = await usersCollection.insertOne(ourUser)
  const userId = newUser.insertedId.toString()

  // create jwt value
  const ourTokenValue = jwt.sign(
    {
      skyColor: "blue",
      userId: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    },
    process.env.JWTSECRET
  )

  // log user in by giving them a cookie
  cookies().set("ourhaikuapp", ourTokenValue, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    secure: true
  })

  return {
    success: true
  }
}
