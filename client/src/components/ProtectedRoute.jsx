import React from 'react'
import { Navigate } from 'react-router-dom'
console.log('[ProtectedRoute] imported useAuth:', !!useAuth);
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}
