import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

// Maximum file size: 10MB (mobile photos can be large)
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

export async function saveImage(file: File): Promise<string> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      throw new Error(
        `Image file is too large (${fileSizeMB}MB). Maximum allowed size is 10MB. ` +
        `Please compress the image or use a smaller file.`
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const fileType = file.type || 'image/jpeg'
    
    if (!validTypes.includes(fileType.toLowerCase())) {
      throw new Error(
        `Invalid file type: ${fileType}. ` +
        `Please use JPEG, PNG, WebP, or GIF images only.`
      )
    }

    const filename = `${nanoid()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
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
    // Add timeout for slower mobile connections
    const blob = await Promise.race([
      put(filename, file, {
        access: 'public',
        contentType: fileType,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout. The image may be too large or your connection is too slow.')), 60000)
      ) as Promise<never>
    ])
    
    return blob.url
  } catch (error: any) {
    console.error('Error uploading image to Vercel Blob:', error)
    
    // If it's already a formatted error message, just throw it
    if (error.message && (error.message.includes('too large') || error.message.includes('Invalid file type'))) {
      throw error
    }
    
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
    
    // Network/timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('network')) {
      throw new Error(
        'Upload failed due to network issue. ' +
        'Please check your internet connection and try again. ' +
        'If the image is very large, try compressing it first.'
      )
    }
    
    throw new Error('Failed to upload image: ' + (error.message || 'Unknown error'))
  }
}
