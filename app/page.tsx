'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Car } from '@/lib/db'
import LocationLink from './components/LocationLink'

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [shopPhotos, setShopPhotos] = useState<any[]>([])
  const [filters, setFilters] = useState({
    search: '',
    maxPrice: '',
    year: '',
    fuelType: '',
    noOfOwner: '',
  })

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.year) params.append('year', filters.year)
      if (filters.fuelType) params.append('fuelType', filters.fuelType)
      if (filters.noOfOwner) params.append('noOfOwner', filters.noOfOwner)

      const response = await fetch(`/api/cars?${params.toString()}`)
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchShopPhotos = useCallback(async () => {
    try {
      const response = await fetch('/api/shop-photos')
      const data = await response.json()
      setShopPhotos(data)
    } catch (error) {
      console.error('Error fetching shop photos:', error)
    }
  }, [])

  useEffect(() => {
    fetchShopPhotos()
  }, [fetchShopPhotos])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

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
          <div>
            <h1 className="logo">Jain Shree Motors</h1>
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              📞 <a href="tel:+919826452400" style={{ color: '#2563eb', textDecoration: 'none' }}>9826452400</a> | 
              <a href="tel:+919827028266" style={{ color: '#2563eb', textDecoration: 'none', marginLeft: '0.25rem' }}>9827028266</a>
            </div>
          </div>
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
              <label>Max Price (₹)</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Year (and after)</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year} and after</option>
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
                <option value="CNG">CNG</option>
              </select>
            </div>
            <div className="filter-group">
              <label>No. of Owner</label>
              <input
                type="text"
                placeholder="e.g., First hand"
                value={filters.noOfOwner}
                onChange={(e) => handleFilterChange('noOfOwner', e.target.value)}
              />
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* About Our Shop Section */}
      <section style={{ 
        background: '#fff', 
        padding: '3rem 1rem', 
        marginTop: '3rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div className="container">
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '2rem',
            fontWeight: 'bold',
            color: '#111'
          }}>
            About Our Shop
          </h2>

          {shopPhotos.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>
                Our Showroom
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem',
                maxWidth: '1000px',
                margin: '0 auto'
              }}>
                {shopPhotos.map((photo) => (
                  <div key={photo._id} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.imageUrl}
                      alt="Jain Shree Motors Showroom"
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Crect fill="%23e5e7eb" width="250" height="250"/%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Contact Information */}
            <div style={{ 
              background: '#f9fafb', 
              padding: '2rem', 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#111' }}>📞 Contact Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="tel:+919826452400" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 500 }}>
                  +91 9826452400
                </a>
                <a href="tel:+919827028266" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 500 }}>
                  +91 9827028266
                </a>
              </div>
            </div>

            {/* Location */}
            <div style={{ 
              background: '#f9fafb', 
              padding: '2rem', 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#111' }}>📍 Visit Us</h3>
              <LocationLink />
            </div>
          </div>
        </div>
      </section>

      <footer style={{ 
        background: '#fff', 
        padding: '2rem 1rem', 
        marginTop: '3rem',
        textAlign: 'center',
        borderTop: '1px solid #e5e7eb'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Contact Us</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <a href="tel:+919826452400" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 500 }}>
            📞 +91 9826452400
          </a>
          <a href="tel:+919827028266" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 500 }}>
            📞 +91 9827028266
          </a>
        </div>
        <p style={{ marginTop: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} Jain Shree Motors. All rights reserved.
        </p>
      </footer>
    </>
  )
}