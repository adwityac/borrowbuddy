const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../lib/tokens')
const jwt = require('jsonwebtoken')

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({ name, email, passwordHash })
    await user.save()

    return res.status(201).json({ message: 'User created' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const payload = { userId: user._id, role: user.role, name: user.name }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    // set refresh token in httpOnly cookie
    res.cookie('bb_rt', refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days fallback
    })

    return res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// Refresh
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies.bb_rt
    if (!token) return res.status(401).json({ message: 'No token' })

    let payload
    try {
      payload = verifyRefreshToken(token)
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    // create new tokens
    const newPayload = { userId: payload.userId, role: payload.role, name: payload.name }
    const accessToken = signAccessToken(newPayload)
    const refreshToken = signRefreshToken(newPayload)

    // set new refresh cookie
    res.cookie('bb_rt', refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    return res.json({ accessToken })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  res.clearCookie('bb_rt', { httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true' })
  return res.json({ message: 'Logged out' })
})

module.exports = router
