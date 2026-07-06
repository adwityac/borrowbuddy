import React from 'react'
import { Link } from 'react-router-dom'
import CTASection from '../components/CTASection'
import mockItems from '../data/mockItems'
import ItemGrid from '../components/ItemGrid'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">Borrow Anything. Share Freely.</h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-600">Join your local community - give and take with zero cost.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/browse" className="px-5 py-3 rounded-full bg-primary text-white font-medium">Browse Items</Link>
            <Link to="/items" className="px-5 py-3 rounded-full border bg-white font-medium">List an Item</Link>
          </div>

          <div className="mt-8 w-80 max-w-full">
            <CTASection />
          </div>
        </div>

        <div className="flex justify-end w-full h-full">
          <div className="bg-white rounded-soft p-4 lg:p-6 card-shadow w-full">
            <img
              src="/neighbour.jpg"
              alt="Neighbors sharing items"
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Popular in your area</h2>
            <p className="text-gray-500">A preview of commonly shared items.</p>
          </div>
          <Link to="/browse" className="text-primary text-sm font-medium">See all</Link>
        </div>
        <ItemGrid items={mockItems.slice(0, 6)} />
      </section>
    </div>
  )
}
