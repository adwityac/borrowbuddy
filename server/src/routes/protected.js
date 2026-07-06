const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/authMiddleware')
const User = require('../models/User')

// example protected route
router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user })
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile' })
  }
})

router.put('/me', requireAuth, async (req, res) => {
  try {
    const updates = {}
    if (req.body.name) updates.name = req.body.name.trim()

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash')

    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

module.exports = router
