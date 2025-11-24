import React from 'react'
import CTASection from '../components/CTASection'
import mockItems from '../data/mockItems'
import ItemGrid from '../components/ItemGrid'


export default function HomePage() {
return (
<div className="max-w-7xl mx-auto px-6 py-12">
<section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center">
<div>
<h1 className="text-6xl font-extrabold text-gray-900">Borrow Anything. Share Freely.</h1>
<p className="mt-4 text-2xl text-gray-600">Join your local community — give and take with zero cost.</p>


<div className="mt-8 w-80">
<CTASection />
</div>
</div>



<div className="flex justify-end w-full h-full">
  <div className="bg-white rounded-soft p-8 lg:p-12 card-shadow w-full">
    <img
      src="/neighbour.jpg"
      alt="Community illustration"
      className="w-full h-auto rounded-md object-cover"
    />
  </div>
</div>



</section>


<section className="mt-16">
<h2 className="text-2xl font-bold mb-4">Popular in your area</h2>
<ItemGrid items={mockItems.slice(0, 6)} />
</section>
</div>
)
}