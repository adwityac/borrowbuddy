import React from 'react'

const availabilityOptions = [
  { value: 'all', label: 'All availability' },
  { value: 'available', label: 'Available' },
  { value: 'borrowed', label: 'Borrowed' },
  { value: 'unavailable', label: 'Unavailable' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A-Z' },
]

export default function CategoryFilterBar({ search, onSearchChange, availability, onAvailabilityChange, sort, onSortChange }) {
  return (
    <div className="bg-white p-3 rounded-soft card-shadow grid gap-3 md:grid-cols-[1fr_auto_auto]">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-3 py-2 border rounded-md text-sm"
        placeholder="Search items"
      />

      <select
        value={availability}
        onChange={(e) => onAvailabilityChange(e.target.value)}
        className="px-3 py-2 border rounded-md text-sm"
      >
        {availabilityOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border rounded-md text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}
