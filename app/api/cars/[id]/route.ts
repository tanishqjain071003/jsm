import { NextRequest, NextResponse } from 'next/server'
import { getCarById, updateCar, deleteCar } from '@/lib/db'
import { getAuthToken, verifyToken } from '@/lib/auth'
import { saveImage } from '@/lib/blob'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const car = await getCarById(params.id)
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(car)
  } catch (error) {
    console.error('Error fetching car:', error)
    return NextResponse.json(
      { error: 'Failed to fetch car' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()

    const updateData: any = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      year: Number(formData.get('year')),
      fuelType: formData.get('fuelType') as 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid',
      transmission: formData.get('transmission') as 'Manual' | 'Automatic',
      mileage: Number(formData.get('mileage')),
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      status: formData.get('status') as 'Available' | 'Sold',
    }

    const mainImageFile = formData.get('mainImage') as File
    if (mainImageFile && mainImageFile.size > 0) {
      updateData.mainImage = await saveImage(mainImageFile)
    }

    const galleryFiles = formData.getAll('galleryImages') as File[]
    const newGalleryImages: string[] = []
    for (const file of galleryFiles) {
      if (file && file.size > 0) {
        const imageUrl = await saveImage(file)
        newGalleryImages.push(imageUrl)
      }
    }

    const existingGallery = formData.get('existingGallery') as string
    if (existingGallery) {
      const existingImages = JSON.parse(existingGallery)
      if (newGalleryImages.length > 0) {
        updateData.galleryImages = [...existingImages, ...newGalleryImages]
      } else {
        updateData.galleryImages = existingImages
      }
    } else if (newGalleryImages.length > 0) {
      updateData.galleryImages = newGalleryImages
    }

    const car = await updateCar(params.id, updateData)
    return NextResponse.json(car)
  } catch (error) {
    console.error('Error updating car:', error)
    return NextResponse.json(
      { error: 'Failed to update car' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await deleteCar(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting car:', error)
    return NextResponse.json(
      { error: 'Failed to delete car' },
      { status: 500 }
    )
  }
}