'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Car } from '@/lib/db'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'cars' | 'shop'>('cars')
  const [shopPhotos, setShopPhotos] = useState<any[]>([])
  const [showShopPhotoForm, setShowShopPhotoForm] = useState(false)
  const [logo, setLogo] = useState<any>(null)
  const [showLogoForm, setShowLogoForm] = useState(false)

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check')
      const data = await response.json()
      if (data.authenticated) {
        setAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }, [router])

  const fetchCars = useCallback(async () => {
    try {
      const response = await fetch('/api/cars?status=')
      const data = await response.json()
      // Convert _id from ObjectId to string if needed
      const carsWithStringIds = data.map((car: any) => ({
        ...car,
        _id: car._id?.toString() || car._id,
      }))
      setCars(carsWithStringIds)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const fetchShopPhotos = useCallback(async () => {
    try {
      const response = await fetch('/api/shop-photos')
      const data = await response.json()
      setShopPhotos(data)
    } catch (error) {
      console.error('Error fetching shop photos:', error)
    }
  }, [])

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
    if (authenticated) {
      fetchCars()
      fetchShopPhotos()
      fetchLogo()
    }
  }, [authenticated, fetchCars, fetchShopPhotos, fetchLogo])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCars(cars.filter(car => car._id !== id))
        setDeleteConfirm(null)
      } else {
        alert('Failed to delete car')
      }
    } catch (error) {
      console.error('Error deleting car:', error)
      alert('Failed to delete car')
    }
  }

  if (!authenticated) {
    return <div className="loading">Checking authentication...</div>
  }

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
            <span className="logo">Jain Shree Motors - Admin</span>
          </Link>
          <button onClick={handleLogout} className="button button-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', background: '#f5f5f5', padding: '0.25rem', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveTab('cars')}
                className="button"
                style={{
                  background: activeTab === 'cars' ? '#2563eb' : 'transparent',
                  color: activeTab === 'cars' ? 'white' : '#666',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cars
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className="button"
                style={{
                  background: activeTab === 'shop' ? '#2563eb' : 'transparent',
                  color: activeTab === 'shop' ? 'white' : '#666',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Shop Photos
              </button>
            </div>
            {activeTab === 'cars' && (
              <button
                onClick={() => {
                  setEditingCar(null)
                  setShowForm(true)
                }}
                className="button button-primary"
              >
                + Add New Car
              </button>
            )}
            {activeTab === 'shop' && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowLogoForm(true)}
                  className="button button-primary"
                >
                  {logo ? 'Update Logo' : 'Add Logo'}
                </button>
                <button
                  onClick={() => setShowShopPhotoForm(true)}
                  className="button button-primary"
                >
                  + Add Shop Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'shop' && (
          <ShopPhotosSection
            photos={shopPhotos}
            onRefresh={fetchShopPhotos}
            showForm={showShopPhotoForm}
            onCloseForm={() => setShowShopPhotoForm(false)}
            logo={logo}
            onLogoRefresh={fetchLogo}
            showLogoForm={showLogoForm}
            onCloseLogoForm={() => setShowLogoForm(false)}
            onOpenLogoForm={() => setShowLogoForm(true)}
          />
        )}

        {activeTab === 'cars' && (
          <>
            {showForm && (
        <CarForm
          key={editingCar?._id || 'new'}
          car={editingCar}
          onSave={() => {
            setShowForm(false)
            setEditingCar(null)
            fetchCars()
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingCar(null)
          }}
        />
        )}

        {loading ? (
          <div className="loading">Loading cars...</div>
        ) : (
          <div className="cars-list">
            {cars.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p>No cars added yet. Click &quot;Add New Car&quot; to get started.</p>
              </div>
            ) : (
              cars.map((car) => (
                <div key={car._id} className="car-list-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.mainImage || '/placeholder-car.jpg'}
                    alt={car.name}
                    className="car-list-image"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Crect fill="%23e5e7eb" width="120" height="80"/%3E%3C/svg%3E'
                    }}
                  />
                  <div className="car-list-info">
                    <div className="car-list-name">{car.name}</div>
                    <div className="car-list-price">₹{car.price.toLocaleString()}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                      {car.year} • {car.fuelType} • {car.status}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#2563eb', marginTop: '0.5rem', fontWeight: 500 }}>
                      👁️ {car.views || 0} {car.views === 1 ? 'view' : 'views'}
                    </div>
                  </div>
                  <div className="car-list-actions">
                    <button
                      onClick={() => {
                        setEditingCar(car)
                        setShowForm(true)
                      }}
                      className="button button-primary button-small"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(car._id!)}
                      className="button button-danger button-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {deleteConfirm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                maxWidth: '400px',
                margin: '1rem',
              }}
            >
              <h2 style={{ marginBottom: '1rem' }}>Confirm Delete</h2>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Are you sure you want to delete this car? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="button button-danger"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="button button-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </>
  )
}

function ShopPhotosSection({ photos, onRefresh, showForm, onCloseForm, logo, onLogoRefresh, showLogoForm, onCloseLogoForm, onOpenLogoForm }: { 
  photos: any[]
  onRefresh: () => void
  showForm: boolean
  onCloseForm: () => void
  logo: any
  onLogoRefresh: () => void
  showLogoForm: boolean
  onCloseLogoForm: () => void
  onOpenLogoForm: () => void
}) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteLogoConfirm, setDeleteLogoConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoLoading, setLogoLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoError, setLogoError] = useState('')

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/shop-photos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
        setDeleteConfirm(null)
      } else {
        alert('Failed to delete photo')
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
      alert('Failed to delete photo')
    }
  }

  const handleAddPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const imageFile = formData.get('image') as File

      if (!imageFile || imageFile.size === 0) {
        setError('Please select an image')
        setLoading(false)
        return
      }

      const uploadData = new FormData()
      uploadData.append('image', imageFile)

      const response = await fetch('/api/shop-photos', {
        method: 'POST',
        body: uploadData,
      })

      if (response.ok) {
        onRefresh()
        onCloseForm()
        e.currentTarget.reset()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to upload photo' }))
        setError(errorData.error || 'Failed to upload photo')
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLogoError('')
    setLogoLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const imageFile = formData.get('image') as File

      if (!imageFile || imageFile.size === 0) {
        setLogoError('Please select an image')
        setLogoLoading(false)
        return
      }

      const uploadData = new FormData()
      uploadData.append('image', imageFile)

      const response = await fetch('/api/logo', {
        method: 'POST',
        body: uploadData,
      })

      if (response.ok) {
        onLogoRefresh()
        onCloseLogoForm()
        e.currentTarget.reset()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to upload logo' }))
        setLogoError(errorData.error || 'Failed to upload logo')
      }
    } catch (error: any) {
      setLogoError(error.message || 'Something went wrong')
    } finally {
      setLogoLoading(false)
    }
  }

  const handleDeleteLogo = async () => {
    try {
      const response = await fetch('/api/logo', {
        method: 'DELETE',
      })

      if (response.ok) {
        onLogoRefresh()
        setDeleteLogoConfirm(false)
      } else {
        alert('Failed to delete logo')
      }
    } catch (error) {
      console.error('Error deleting logo:', error)
      alert('Failed to delete logo')
    }
  }

  return (
    <>
      {/* Logo Management */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Logo Management</h2>
        
        {showLogoForm && (
          <form onSubmit={handleLogoUpload} className="form-group" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{logo ? 'Update Logo' : 'Add Logo'}</h3>
            {logoError && (
              <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
                {logoError}
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="logoImage">Logo Image *</label>
              <input
                type="file"
                id="logoImage"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                required
              />
              <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
                Maximum file size: 10MB. Supported formats: JPEG, PNG, WebP, GIF. Recommended: PNG with transparent background.
              </small>
            </div>
            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={logoLoading}>
                {logoLoading ? 'Uploading...' : logo ? 'Update Logo' : 'Add Logo'}
              </button>
              <button type="button" onClick={onCloseLogoForm} className="button button-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}

        {logo && (
          <div style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
            padding: '2rem', 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e2e8f0',
            display: 'inline-block'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Current Logo</h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.imageUrl}
                alt="Current Logo"
                style={{ maxHeight: '100px', maxWidth: '300px', objectFit: 'contain', borderRadius: '8px' }}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="100"%3E%3Crect fill="%23e5e7eb" width="300" height="100"/%3E%3C/svg%3E'
                }}
              />
            </div>
            <button
              onClick={() => setDeleteLogoConfirm(true)}
              className="button button-danger button-small"
            >
              Delete Logo
            </button>
          </div>
        )}

        {!logo && !showLogoForm && (
          <div style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
            padding: '2rem', 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>No logo uploaded yet.</p>
            <button
              onClick={onOpenLogoForm}
              className="button button-primary"
            >
              Add Logo
            </button>
          </div>
        )}
      </div>

      {/* Shop Photos Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Shop Photos</h2>
      </div>

      {showForm && (
        <form onSubmit={handleAddPhoto} className="form-group" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Add Shop Photo</h2>
          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="shopImage">Shop Photo *</label>
            <input
              type="file"
              id="shopImage"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              required
            />
            <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
              Maximum file size: 10MB. Supported formats: JPEG, PNG, WebP, GIF
            </small>
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Uploading...' : 'Add Photo'}
            </button>
            <button type="button" onClick={onCloseForm} className="button button-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="cars-list">
        {photos.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p>No shop photos added yet. Click &quot;Add Shop Photo&quot; to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {photos.map((photo) => (
              <div key={photo._id} style={{ position: 'relative', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt="Shop photo"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3C/svg%3E'
                  }}
                />
                <button
                  onClick={() => setDeleteConfirm(photo._id)}
                  className="button button-danger button-small"
                  style={{ width: '100%', marginTop: '0.5rem', borderRadius: '0 0 8px 8px' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '400px',
              margin: '1rem',
            }}
          >
            <h2 style={{ marginBottom: '1rem' }}>Confirm Delete</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Are you sure you want to delete this shop photo?
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="button button-danger"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="button button-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Logo Confirmation */}
      {deleteLogoConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '400px',
              margin: '1rem',
            }}
          >
            <h2 style={{ marginBottom: '1rem' }}>Confirm Delete</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Are you sure you want to delete the logo?
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleDeleteLogo}
                className="button button-danger"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteLogoConfirm(false)}
                className="button button-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function CarForm({ car, onSave, onCancel }: { car: Car | null; onSave: () => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: car?.name || '',
    brand: car?.brand || '',
    year: car?.year || new Date().getFullYear(),
    fuelType: car?.fuelType || 'Petrol',
    transmission: car?.transmission || 'Manual',
    mileage: car?.mileage || 0,
    price: car?.price || 0,
    description: car?.description || '',
    status: car?.status || 'Available',
    noOfOwner: car?.noOfOwner || '',
    color: car?.color || '',
    insuranceType: car?.insuranceType || 'No insurance',
    enginePower: car?.enginePower || 0,
    variant: car?.variant || '',
  })
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [existingGallery, setExistingGallery] = useState<string[]>(car?.galleryImages || [])
  const [mainImagePreview, setMainImagePreview] = useState<string>(car?.mainImage || '')
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset form when car changes
  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name,
        brand: car.brand,
        year: car.year,
        fuelType: car.fuelType,
        transmission: car.transmission,
        mileage: car.mileage,
        price: car.price,
        description: car.description,
        status: car.status,
        noOfOwner: car.noOfOwner || '',
        color: car.color || '',
        insuranceType: car.insuranceType || 'No insurance',
        enginePower: car.enginePower || 0,
        variant: car.variant || '',
      })
      setMainImagePreview(car.mainImage)
      setExistingGallery(car.galleryImages || [])
    } else {
      setFormData({
        name: '',
        brand: '',
        year: new Date().getFullYear(),
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 0,
        price: 0,
        description: '',
        status: 'Available',
        noOfOwner: '',
        color: '',
        insuranceType: 'No insurance',
        enginePower: 0,
        variant: '',
      })
      setMainImagePreview('')
      setExistingGallery([])
    }
    setMainImage(null)
    setGalleryImages([])
    setGalleryPreviews([])
  }, [car])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' || name === 'price' || name === 'enginePower' ? Number(value) : value,
    }))
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
        setError(`Main image is too large (${fileSizeMB}MB). Maximum allowed size is 10MB. Please compress the image or use a smaller file.`)
        e.target.value = '' // Clear the input
        return
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(file.type.toLowerCase())) {
        setError(`Invalid file type: ${file.type}. Please use JPEG, PNG, WebP, or GIF images only.`)
        e.target.value = '' // Clear the input
        return
      }

      setError('') // Clear any previous errors
      setMainImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate all files before adding
    const validFiles: File[] = []
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
        setError(`Gallery image "${file.name}" is too large (${fileSizeMB}MB). Maximum allowed size is 10MB.`)
        continue
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(file.type.toLowerCase())) {
        setError(`Invalid file type for "${file.name}": ${file.type}. Please use JPEG, PNG, WebP, or GIF images only.`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) {
      e.target.value = '' // Clear the input
      return
    }

    setError('') // Clear any previous errors
    setGalleryImages(prev => [...prev, ...validFiles])
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
    
    e.target.value = '' // Clear the input after processing
  }

  const removeGalleryImage = (index: number) => {
    if (index < existingGallery.length) {
      // Removing existing image
      setExistingGallery(prev => prev.filter((_, i) => i !== index))
    } else {
      // Removing new image
      const newIndex = index - existingGallery.length
      const updatedFiles = galleryImages.filter((_, i) => i !== newIndex)
      const updatedPreviews = galleryPreviews.filter((_, i) => i !== newIndex)
      setGalleryImages(updatedFiles)
      setGalleryPreviews(updatedPreviews)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('brand', formData.brand)
      formDataToSend.append('year', formData.year.toString())
      formDataToSend.append('fuelType', formData.fuelType)
      formDataToSend.append('transmission', formData.transmission)
      formDataToSend.append('mileage', formData.mileage.toString())
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('description', formData.description)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('noOfOwner', formData.noOfOwner)
      formDataToSend.append('color', formData.color)
      formDataToSend.append('insuranceType', formData.insuranceType)
      formDataToSend.append('enginePower', formData.enginePower.toString())
      formDataToSend.append('variant', formData.variant)

      if (car?._id) {
        // Update
        if (mainImage) {
          formDataToSend.append('mainImage', mainImage)
        }
        formDataToSend.append('existingGallery', JSON.stringify(existingGallery))
        galleryImages.forEach(file => {
          formDataToSend.append('galleryImages', file)
        })

        const response = await fetch(`/api/cars/${car._id}`, {
          method: 'PUT',
          body: formDataToSend,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to update car' }))
          throw new Error(errorData.error || 'Failed to update car')
        }
      } else {
        // Create
        if (!mainImage) {
          setError('Main image is required')
          setLoading(false)
          return
        }
        formDataToSend.append('mainImage', mainImage)
        galleryImages.forEach(file => {
          formDataToSend.append('galleryImages', file)
        })

        const response = await fetch('/api/cars', {
          method: 'POST',
          body: formDataToSend,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to create car' }))
          throw new Error(errorData.error || 'Failed to create car')
        }
      }

      onSave()
    } catch (error: any) {
      setError(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const years = []
  const currentYear = new Date().getFullYear()
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year)
  }

  return (
    <form onSubmit={handleSubmit} className="form-group" style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>{car ? 'Edit Car' : 'Add New Car'}</h2>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="name">Car Name / Model *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Honda City 2020"
          />
        </div>

        <div>
          <label htmlFor="brand">Brand *</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            required
            placeholder="e.g., Honda"
          />
        </div>

        <div>
          <label htmlFor="year">Year *</label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fuelType">Fuel Type *</label>
          <select
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleInputChange}
            required
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="CNG">CNG</option>
          </select>
        </div>

        <div>
          <label htmlFor="transmission">Transmission *</label>
          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleInputChange}
            required
          >
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <div>
          <label htmlFor="mileage">Mileage (km) *</label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleInputChange}
            required
            min="0"
            placeholder="e.g., 50000"
          />
        </div>

        <div>
          <label htmlFor="price">Asking Price (₹) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            placeholder="e.g., 500000"
          />
        </div>

        <div>
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        <div>
          <label htmlFor="noOfOwner">No. of Owner</label>
          <input
            type="text"
            id="noOfOwner"
            name="noOfOwner"
            value={formData.noOfOwner}
            onChange={handleInputChange}
            placeholder="e.g., First hand, Second hand"
          />
        </div>

        <div>
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="e.g., White, Black, Red"
          />
        </div>

        <div>
          <label htmlFor="insuranceType">Insurance Type</label>
          <select
            id="insuranceType"
            name="insuranceType"
            value={formData.insuranceType}
            onChange={handleInputChange}
          >
            <option value="Comprehensive">Comprehensive</option>
            <option value="No insurance">No insurance</option>
            <option value="Third party">Third party</option>
            <option value="Zero Dep">Zero Dep</option>
          </select>
        </div>

        <div>
          <label htmlFor="enginePower">Engine Power (cc)</label>
          <input
            type="number"
            id="enginePower"
            name="enginePower"
            value={formData.enginePower}
            onChange={handleInputChange}
            min="0"
            placeholder="e.g., 1200"
          />
        </div>

        <div>
          <label htmlFor="variant">Variant</label>
          <input
            type="text"
            id="variant"
            name="variant"
            value={formData.variant}
            onChange={handleInputChange}
            placeholder="e.g., VX, ZX, Base Model"
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="description">Description / Notes</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Add any additional information about the car..."
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="mainImage">
          Main Image {!car && '*'}
          {car && <small>(Leave empty to keep current image)</small>}
        </label>
        <input
          type="file"
          id="mainImage"
          name="mainImage"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleMainImageChange}
          required={!car}
        />
        <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
          Maximum file size: 10MB. Supported formats: JPEG, PNG, WebP, GIF
        </small>
        {mainImagePreview && (
          <div className="image-preview">
            <div className="preview-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainImagePreview} alt="Preview" />
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="galleryImages">Additional Images (Optional)</label>
        <input
          type="file"
          id="galleryImages"
          name="galleryImages"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          multiple
          onChange={handleGalleryChange}
        />
        <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
          Maximum file size: 10MB per image. Supported formats: JPEG, PNG, WebP, GIF
        </small>
        {(existingGallery.length > 0 || galleryPreviews.length > 0) && (
          <div className="image-preview">
            {existingGallery.map((image, index) => (
              <div key={`existing-${image}-${index}`} className="preview-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`Gallery ${index + 1}`} onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e5e7eb" width="150" height="150"/%3E%3C/svg%3E'
                }} />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="remove-image"
                >
                  ×
                </button>
              </div>
            ))}
            {galleryPreviews.map((preview, index) => (
              <div key={`new-${index}`} className="preview-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt={`New ${index + 1}`} onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e5e7eb" width="150" height="150"/%3E%3C/svg%3E'
                }} />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(existingGallery.length + index)}
                  className="remove-image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={loading}>
          {loading ? 'Saving...' : car ? 'Update Car' : 'Add Car'}
        </button>
        <button type="button" onClick={onCancel} className="button button-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}