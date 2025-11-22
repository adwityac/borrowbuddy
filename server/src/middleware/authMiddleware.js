const { verifyAccessToken } = require('../lib/tokens')

function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' })

  const token = auth.split(' ')[1]
  try {
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = { requireAuth }
