import { NextRequest, NextResponse } from 'next/server'
import { getCars, createCar } from '@/lib/db'
import { getAuthToken, verifyToken } from '@/lib/auth'
import { saveImage } from '@/lib/blob'

// Increase timeout for slower mobile connections
export const maxDuration = 60 // 60 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const statusParam = searchParams.get('status')
    const filter: {
      search?: string
      maxPrice?: number
      year?: number
      fuelType?: string
      noOfOwner?: string
      status?: 'Available' | 'Sold' | '' | null
    } = {
      search: searchParams.get('search') || undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      noOfOwner: searchParams.get('noOfOwner') || undefined,
      status: statusParam === '' ? '' : (statusParam === 'Available' || statusParam === 'Sold' ? statusParam : undefined),
    }

    const cars = await getCars(filter)
    return NextResponse.json(cars)
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const brand = formData.get('brand') as string
    const year = Number(formData.get('year'))
    const fuelType = formData.get('fuelType') as 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
    const transmission = formData.get('transmission') as 'Manual' | 'Automatic'
    const mileage = Number(formData.get('mileage'))
    const price = Number(formData.get('price'))
    const description = formData.get('description') as string
    const status = formData.get('status') as 'Available' | 'Sold'
    const noOfOwner = formData.get('noOfOwner') as string
    const color = formData.get('color') as string
    const insuranceType = formData.get('insuranceType') as 'Comprehensive' | 'No insurance' | 'Third party' | 'Zero Dep'
    const enginePower = Number(formData.get('enginePower'))

    const mainImageFile = formData.get('mainImage') as File
    if (!mainImageFile || mainImageFile.size === 0) {
      return NextResponse.json(
        { error: 'Main image is required' },
        { status: 400 }
      )
    }

    const mainImage = await saveImage(mainImageFile)

    const galleryFiles = formData.getAll('galleryImages') as File[]
    const galleryImages: string[] = []
    for (const file of galleryFiles) {
      if (file && file.size > 0) {
        try {
          const imageUrl = await saveImage(file)
          galleryImages.push(imageUrl)
        } catch (error: any) {
          console.error('Error uploading gallery image:', error)
          return NextResponse.json(
            { error: `Failed to upload gallery image: ${error.message || 'Unknown error'}` },
            { status: 400 }
          )
        }
      }
    }

    const car = await createCar({
      name,
      brand,
      year,
      fuelType,
      transmission,
      mileage,
      price,
      description,
      status,
      mainImage,
      galleryImages,
      noOfOwner: noOfOwner || '',
      color: color || '',
      insuranceType: insuranceType || 'No insurance',
      enginePower: enginePower || 0,
    })

    return NextResponse.json(car, { status: 201 })
  } catch (error: any) {
    console.error('Error creating car:', error)
    
    // Return specific error message to help user understand the issue
    const errorMessage = error.message || 'Failed to create car'
    
    // Check if it's a known error (file size, file type, etc.)
    if (errorMessage.includes('too large') || errorMessage.includes('size')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 413 } // 413 Payload Too Large
      )
    }
    
    if (errorMessage.includes('Invalid file type') || errorMessage.includes('type')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 } // 400 Bad Request
      )
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 408 } // 408 Request Timeout
      )
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}