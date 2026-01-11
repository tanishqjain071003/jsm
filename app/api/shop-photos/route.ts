import { NextRequest, NextResponse } from 'next/server'
import { getShopPhotos, addShopPhoto } from '@/lib/shop'
import { getAuthToken, verifyToken } from '@/lib/auth'
import { saveImage } from '@/lib/blob'

export const maxDuration = 60

export async function GET() {
  try {
    const photos = await getShopPhotos()
    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching shop photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shop photos' },
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
    const imageFile = formData.get('image') as File

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    const imageUrl = await saveImage(imageFile)
    const photo = await addShopPhoto(imageUrl)

    return NextResponse.json(photo, { status: 201 })
  } catch (error: any) {
    console.error('Error adding shop photo:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add shop photo' },
      { status: 500 }
    )
  }
}
