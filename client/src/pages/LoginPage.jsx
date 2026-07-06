import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()
  const location = useLocation()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const res = await login(email, password)
    if (res.ok) nav(location.state?.from?.pathname || '/browse')
    else setError(res.message)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-soft card-shadow">
      <h1 className="text-2xl font-semibold mb-1">Login</h1>
      <p className="text-gray-500 mb-4">Welcome back to BorrowBuddy.</p>
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border px-3 py-2 rounded-md" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border px-3 py-2 rounded-md" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="w-full px-4 py-2 bg-primary text-white rounded-full">Login</button>
      </form>
    </div>
  )
}
