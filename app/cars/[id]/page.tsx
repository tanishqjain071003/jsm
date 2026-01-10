'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Car } from '@/lib/db'

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')

  const fetchCar = useCallback(async () => {
    try {
      const response = await fetch(`/api/cars/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCar(data)
        setSelectedImage(data.mainImage)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching car:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (params.id) {
      fetchCar()
    }
  }, [params.id, fetchCar])

  if (loading) {
    return (
      <div className="loading">
        <p>Loading car details...</p>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="empty-state">
        <h2>Car not found</h2>
        <Link href="/" className="back-button">
          Back to Home
        </Link>
      </div>
    )
  }

  const allImages = [car.mainImage, ...(car.galleryImages || [])].filter(Boolean)

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo">
            Jain Shree Motors
          </Link>
        </div>
      </header>

      <div className="detail-page">
        <Link href="/" className="back-button">
          ← Back to All Cars
        </Link>

        <div className="image-gallery">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage || car.mainImage}
            alt={car.name}
            className="main-image"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"%3E%3Crect fill="%23e5e7eb" width="800" height="500"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {allImages.length > 1 && (
            <div className="gallery-images">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {allImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${car.name} - Image ${index + 1}`}
                  className="gallery-image"
                  onClick={() => setSelectedImage(image)}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e5e7eb" width="150" height="150"/%3E%3C/svg%3E'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-header">
          <h1 className="detail-title">{car.name}</h1>
          <p className="detail-price">₹{car.price.toLocaleString()}</p>

          <div className="detail-specs">
            <div className="spec-item">
              <span className="spec-label">Brand</span>
              <span className="spec-value">{car.brand}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Year</span>
              <span className="spec-value">{car.year}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Fuel Type</span>
              <span className="spec-value">{car.fuelType}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Transmission</span>
              <span className="spec-value">{car.transmission}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Mileage</span>
              <span className="spec-value">{car.mileage.toLocaleString()} km</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Status</span>
              <span className="spec-value">{car.status}</span>
            </div>
          </div>

          {car.description && (
            <div className="detail-description">
              <h3>Description</h3>
              <p>{car.description}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}