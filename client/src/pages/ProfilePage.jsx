import React from 'react'
import { useAuth } from '../context/AuthContext'


export default function ProfilePage() {
const { user } = useAuth()


return (
<div className="max-w-4xl mx-auto px-6 py-10">
<div className="bg-white p-6 rounded-soft card-shadow flex gap-6 items-center">
<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl">{user?.name[0]}</div>
<div>
<h1 className="text-2xl font-bold">{user?.name}</h1>
<p className="text-gray-500">Member since 2024</p>
</div>
</div>
</div>
)
}
