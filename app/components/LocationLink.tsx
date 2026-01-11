'use client'

export default function LocationLink() {
  const shopLocation = process.env.NEXT_PUBLIC_SHOP_LOCATION || 'Jain Shree Motors'
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopLocation)}`

  return (
    <>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ 
          color: '#2563eb', 
          textDecoration: 'none', 
          fontSize: '1rem',
          display: 'inline-block',
          marginTop: '0.5rem'
        }}
      >
        📍 View on Google Maps →
      </a>
      <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {shopLocation}
      </p>
    </>
  )
}
