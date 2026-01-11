import { NextRequest, NextResponse } from 'next/server'
import { getLogo, setLogo, deleteLogo } from '@/lib/logo'
import { getAuthToken, verifyToken } from '@/lib/auth'
import { saveImage } from '@/lib/blob'

export const maxDuration = 60

export async function GET() {
  try {
    const logo = await getLogo()
    // Return null if no logo exists, not an error
    return NextResponse.json(logo || null)
  } catch (error) {
    console.error('Error fetching logo:', error)
    return NextResponse.json(null)
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
    const logo = await setLogo(imageUrl)

    return NextResponse.json(logo, { status: 201 })
  } catch (error: any) {
    console.error('Error setting logo:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to set logo' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await deleteLogo()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting logo:', error)
    return NextResponse.json(
      { error: 'Failed to delete logo' },
      { status: 500 }
    )
  }
}
