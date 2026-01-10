import { NextRequest, NextResponse } from 'next/server'
import { getCars, createCar } from '@/lib/db'
import { getAuthToken, verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'

const uploadDir = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

async function saveImage(file: File): Promise<string> {
  await ensureUploadDir()
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${nanoid()}-${file.name}`
  const filepath = path.join(uploadDir, filename)
  await writeFile(filepath, buffer)
  return `/uploads/${filename}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const statusParam = searchParams.get('status')
    const filter = {
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      status: statusParam === '' ? '' : (statusParam as 'Available' | 'Sold') || undefined,
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
        const imageUrl = await saveImage(file)
        galleryImages.push(imageUrl)
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
    })

    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    console.error('Error creating car:', error)
    return NextResponse.json(
      { error: 'Failed to create car' },
      { status: 500 }
    )
  }
}