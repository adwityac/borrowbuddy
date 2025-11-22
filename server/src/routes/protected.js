const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/authMiddleware')

// example protected route
router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user })
})

module.exports = router
