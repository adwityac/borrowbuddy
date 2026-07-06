import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-600 flex flex-col gap-3 md:flex-row md:justify-between">
        <div>Copyright {new Date().getFullYear()} BorrowBuddy</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-900">About</a>
          <a href="#" className="hover:text-gray-900">Support</a>
          <a href="#" className="hover:text-gray-900">Blog</a>
        </div>
      </div>
    </footer>
  )
}
