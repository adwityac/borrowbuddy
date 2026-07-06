import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`

  return (
    <nav className="w-full bg-white border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full font-bold">
          BB
        </div>
        <span className="font-semibold text-lg">BorrowBuddy</span>
      </Link>

      <div className="flex flex-wrap items-center gap-4">
        <NavLink to="/" className={linkClass}>Home</NavLink>
        <NavLink to="/browse" className={linkClass}>Browse</NavLink>
        {user && (
          <>
            <NavLink to="/items" className={linkClass}>My Items</NavLink>
            <NavLink to="/requests" className={linkClass}>My Requests</NavLink>
            <NavLink to="/incoming-requests" className={linkClass}>Incoming</NavLink>
            <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            {user.role === 'admin' && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link to="/login" className="px-4 py-2 border rounded-full">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-full text-white bg-green-600">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      </div>
    </nav>
  )
}
