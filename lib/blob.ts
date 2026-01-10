import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function saveImage(file: File): Promise<string> {
  try {
    const filename = `${nanoid()}-${file.name}`
    
    // Check if token is available (Vercel Blob automatically reads from process.env.BLOB_READ_WRITE_TOKEN)
    const token = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!token) {
      throw new Error(
        'BLOB_READ_WRITE_TOKEN is not set in environment variables. ' +
        'Please add it in Vercel Dashboard → Your Project → Settings → Environment Variables. ' +
        'See VERCEL_SETUP.md for detailed instructions.'
      )
    }
    
    // Vercel Blob automatically uses BLOB_READ_WRITE_TOKEN from process.env
    // The put function will automatically pick it up
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type || 'image/jpeg',
    })
    
    return blob.url
  } catch (error: any) {
    console.error('Error uploading image to Vercel Blob:', error)
    
    // Provide helpful error message for token-related errors
    if (
      error.message?.includes('token') || 
      error.message?.includes('BLOB') || 
      error.message?.includes('BLOB_READ_WRITE_TOKEN') ||
      error.message?.includes('No token found')
    ) {
      throw new Error(
        'Vercel Blob token not found. ' +
        'Please set BLOB_READ_WRITE_TOKEN in your Vercel project environment variables. ' +
        'Instructions: See VERCEL_SETUP.md file or go to: ' +
        'Vercel Dashboard → Your Project → Settings → Environment Variables → Add BLOB_READ_WRITE_TOKEN. ' +
        'Get your token from: Vercel Dashboard → Settings → Tokens → Create Token (with Blob scope).'
      )
    }
    
    throw new Error('Failed to upload image: ' + (error.message || 'Unknown error'))
  }
}
