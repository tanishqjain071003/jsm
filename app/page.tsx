'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Car } from '@/lib/db'

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    year: '',
    fuelType: '',
  })

  useEffect(() => {
    fetchCars()
  }, [filters])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.year) params.append('year', filters.year)
      if (filters.fuelType) params.append('fuelType', filters.fuelType)

      const response = await fetch(`/api/cars?${params.toString()}`)
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const years = []
  const currentYear = new Date().getFullYear()
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year)
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Jain Shree Motors</h1>
          <Link href="/admin/login" className="admin-link">
            Admin
          </Link>
        </div>
      </header>

      <div className="search-section">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by model or brand..."
            className="search-bar"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <div className="filters">
            <div className="filter-group">
              <label>Min Price (₹)</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Max Price (₹)</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Fuel Type</label>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="cars-section">
        {loading ? (
          <div className="loading">Loading cars...</div>
        ) : cars.length === 0 ? (
          <div className="empty-state">
            <h2>No cars found</h2>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="cars-grid">
            {cars.map((car) => (
              <Link key={car._id} href={`/cars/${car._id}`}>
                <div className="car-card">
                  <img
                    src={car.mainImage || '/placeholder-car.jpg'}
                    alt={car.name}
                    className="car-image"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div className="car-info">
                    <h2 className="car-name">{car.name}</h2>
                    <p className="car-price">₹{car.price.toLocaleString()}</p>
                    <div className="car-details">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.fuelType}</span>
                      <span>•</span>
                      <span>{car.transmission}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}