const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../lib/tokens')

function publicUser(user) {
  return {
    id: user._id,
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function authPayload(user) {
  return {
    userId: user._id.toString(),
    role: user.role,
    name: user.name,
  }
}

function refreshCookieOptions() {
  const secure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) return res.status(409).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({ name: name.trim(), email: normalizedEmail, passwordHash })
    await user.save()

    return res.status(201).json({ message: 'User created', user: publicUser(user) })
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

    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    if (user.role === 'banned') return res.status(403).json({ message: 'Your account is banned' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const payload = authPayload(user)
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    // set refresh token in httpOnly cookie
    res.cookie('bb_rt', refreshToken, refreshCookieOptions())

    return res.json({ accessToken, user: publicUser(user) })
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

    const user = await User.findById(payload.userId)
    if (!user) return res.status(401).json({ message: 'User not found' })
    if (user.role === 'banned') return res.status(403).json({ message: 'Your account is banned' })

    const newPayload = authPayload(user)
    const accessToken = signAccessToken(newPayload)
    const refreshToken = signRefreshToken(newPayload)

    // set new refresh cookie
    res.cookie('bb_rt', refreshToken, refreshCookieOptions())

    return res.json({ accessToken, user: publicUser(user) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  const options = refreshCookieOptions()
  delete options.maxAge
  res.clearCookie('bb_rt', options)
  return res.json({ message: 'Logged out' })
})

module.exports = router
