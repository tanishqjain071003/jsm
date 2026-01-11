import { NextRequest, NextResponse } from 'next/server'
import { deleteShopPhoto } from '@/lib/shop'
import { getAuthToken, verifyToken } from '@/lib/auth'

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

    await deleteShopPhoto(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting shop photo:', error)
    return NextResponse.json(
      { error: 'Failed to delete shop photo' },
      { status: 500 }
    )
  }
}
