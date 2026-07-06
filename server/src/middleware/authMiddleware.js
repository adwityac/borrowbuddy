const { verifyAccessToken } = require('../lib/tokens')
const User = require('../models/User')

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' })
  }

  const token = auth.split(' ')[1]
  try {
    const payload = verifyAccessToken(token)
    const userId = payload.userId || payload.id
    const user = await User.findById(userId).select('name role')

    if (!user) return res.status(401).json({ message: 'User not found' })
    if (user.role === 'banned') return res.status(403).json({ message: 'Your account is banned' })

    req.user = {
      ...payload,
      id: user._id.toString(),
      userId: user._id.toString(),
      name: user.name,
      role: user.role,
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = { requireAuth }
