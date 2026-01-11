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
  const [logo, setLogo] = useState<any>(null)

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

  const fetchLogo = useCallback(async () => {
    try {
      const response = await fetch('/api/logo')
      const data = await response.json()
      setLogo(data)
    } catch (error) {
      console.error('Error fetching logo:', error)
    }
  }, [])

  useEffect(() => {
    if (params.id) {
      fetchCar()
    }
    fetchLogo()
  }, [params.id, fetchCar, fetchLogo])

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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
            {logo?.imageUrl ? (
              <img 
                src={logo.imageUrl} 
                alt="Jain Shree Motors Logo" 
                className="logo-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <img 
                src="/logo.png" 
                alt="Jain Shree Motors Logo" 
                className="logo-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <span className="logo">Jain Shree Motors</span>
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
          {/* eslint-disable @next/next/no-img-element */}
          {allImages.length > 1 && (
            <div className="gallery-images">
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
          {/* eslint-enable @next/next/no-img-element */}
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
            {car.noOfOwner && (
              <div className="spec-item">
                <span className="spec-label">No. of Owner</span>
                <span className="spec-value">{car.noOfOwner}</span>
              </div>
            )}
            {car.color && (
              <div className="spec-item">
                <span className="spec-label">Color</span>
                <span className="spec-value">{car.color}</span>
              </div>
            )}
            {car.insuranceType && (
              <div className="spec-item">
                <span className="spec-label">Insurance Type</span>
                <span className="spec-value">{car.insuranceType}</span>
              </div>
            )}
            {car.enginePower > 0 && (
              <div className="spec-item">
                <span className="spec-label">Engine Power</span>
                <span className="spec-value">{car.enginePower} cc</span>
              </div>
            )}
            {car.variant && (
              <div className="spec-item">
                <span className="spec-label">Variant</span>
                <span className="spec-value">{car.variant}</span>
              </div>
            )}
          </div>

          {car.description && (
            <div className="detail-description">
              <h3>Description</h3>
              <p>{car.description}</p>
            </div>
          )}
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
          padding: '2.5rem', 
          borderRadius: '20px', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
          marginTop: '2rem',
          textAlign: 'center',
          border: '2px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)' }}></div>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Interested in this car?</h3>
          <a
            href={`https://wa.me/919826452400?text=${encodeURIComponent(`I want to enquire about ${car.name}${car.variant ? ' ' + car.variant : ''} ${car.year} car.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #25D366 0%, #20BA5A 100%)',
              color: 'white',
              padding: '1.125rem 2.5rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #20BA5A 0%, #1DA851 100%)'
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #25D366 0%, #20BA5A 100%)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)'
            }}
          >
            💬 WhatsApp Us
          </a>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Or Call Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <a href="tel:+919826452400" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 600, transition: 'all 0.2s', display: 'inline-block' }}
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.color = '#2563eb'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.color = '#3b82f6'; }}>
                📞 +91 9826452400
              </a>
              <a href="tel:+919827028266" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 600, transition: 'all 0.2s', display: 'inline-block' }}
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.color = '#2563eb'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.color = '#3b82f6'; }}>
                📞 +91 9827028266
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}