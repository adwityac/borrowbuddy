import React from 'react'


export default function Footer() {
return (
<footer className="bg-white border-t mt-12">
<div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-600 flex justify-between">
<div>© {new Date().getFullYear()} BorrowBuddy</div>
<div className="flex gap-4">
<a href="#">About</a>
<a href="#">Support</a>
<a href="#">Blog</a>
</div>
</div>
</footer>
)
}