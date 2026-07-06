import React from 'react'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="bg-primary text-white p-6 rounded-soft card-shadow">
      <ul className="space-y-3 text-base font-semibold">
        <li>Reduce waste by sharing what you already own</li>
        <li>Save money by borrowing before buying</li>
        <li>Build community with neighbors nearby</li>
      </ul>
      <Link to="/browse" className="mt-6 inline-block bg-white text-primary px-6 py-3 rounded-full font-semibold shadow">
        Start Now
      </Link>
    </section>
  )
}
