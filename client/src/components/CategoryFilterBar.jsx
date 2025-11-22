import React from 'react'


export default function CategoryFilterBar() {
return (
<div className="bg-white p-3 rounded-soft card-shadow flex gap-3 flex-wrap">
<select className="px-3 py-2 border rounded-md text-sm">
<option>All Types</option>
<option>Tools</option>
<option>Outdoors</option>
<option>Tech</option>
</select>


<select className="px-3 py-2 border rounded-md text-sm">
<option>Any Size</option>
<option>Small</option>
<option>Medium</option>
<option>Large</option>
</select>


<select className="px-3 py-2 border rounded-md text-sm">
<option>Sort: Newest</option>
<option>Popular</option>
</select>
</div>
)
}