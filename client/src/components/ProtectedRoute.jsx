import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth()
  const location = useLocation()

  if (!authReady) {
    return <p className="p-6 text-gray-500">Checking your session...</p>
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
