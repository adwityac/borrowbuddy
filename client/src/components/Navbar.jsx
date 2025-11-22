import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full font-bold">
          BB
        </div>
        <span className="font-semibold text-lg">BorrowBuddy</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <NavLink to="/" className="text-gray-700">Home</NavLink>
        <NavLink to="/browse" className="text-gray-700">Browse</NavLink>
        <NavLink to="/items" className="text-gray-700">My Items</NavLink>
        <NavLink to="/requests" className="text-gray-700">Requests</NavLink>
        


      </div>

      {/* Right-side Auth Buttons */}
      <div className="flex items-center gap-4">
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
              {user.name[0]}
            </div>
            <span>{user.name}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </nav>
  )
}
