const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' } // 'admin' possible
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
