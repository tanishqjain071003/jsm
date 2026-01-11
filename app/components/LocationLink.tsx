'use client'

export default function LocationLink() {
  const shopLocation = process.env.NEXT_PUBLIC_SHOP_LOCATION || '22.735132,75.901556'
  
  // Parse coordinates (format: "latitude,longitude" or "lat,lng")
  const coordinates = shopLocation.split(',').map(coord => coord.trim())
  const latitude = coordinates[0]
  const longitude = coordinates[1]
  
  // Google Maps URL using coordinates
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

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
        Jain Shree Motors
      </p>
    </>
  )
}
