import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const res = await login(email, password)
    if (res.ok) nav('/') // or nav('/items')
    else setError(res.message)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-soft card-shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border px-3 py-2 rounded-md" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border px-3 py-2 rounded-md" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full px-4 py-2 bg-primary text-white rounded-full">Login</button>
      </form>
    </div>
  )
}