import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function saveImage(file: File): Promise<string> {
  try {
    const filename = `${nanoid()}-${file.name}`
    
    // Vercel Blob automatically uses BLOB_READ_WRITE_TOKEN from environment
    // In production on Vercel, this is automatically available
    // For local development, use: vercel env pull .env.local
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type || 'image/jpeg',
    })
    
    return blob.url
  } catch (error: any) {
    console.error('Error uploading image to Vercel Blob:', error)
    
    // Provide helpful error message
    if (error.message?.includes('token') || error.message?.includes('BLOB')) {
      throw new Error('Vercel Blob token not found. Set BLOB_READ_WRITE_TOKEN in environment variables.')
    }
    
    throw new Error('Failed to upload image: ' + (error.message || 'Unknown error'))
  }
}
