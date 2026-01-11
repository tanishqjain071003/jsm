import clientPromise from './mongodb'

export interface Logo {
  _id?: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export async function getLogo() {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Logo>('logo')

    const logo = await collection.findOne({})
    if (!logo) {
      return null
    }
    return JSON.parse(JSON.stringify(logo))
  } catch (error) {
    console.error('Error fetching logo:', error)
    throw error
  }
}

export async function setLogo(imageUrl: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Logo>('logo')

    // Check if logo exists
    const existing = await collection.findOne({})
    
    if (existing) {
      // Update existing logo
      await collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            imageUrl,
            updatedAt: new Date(),
          },
        }
      )
      return { ...existing, imageUrl, updatedAt: new Date() }
    } else {
      // Create new logo
      const logo: Logo = {
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const result = await collection.insertOne(logo as any)
      return { ...logo, _id: result.insertedId.toString() }
    }
  } catch (error) {
    console.error('Error setting logo:', error)
    throw error
  }
}

export async function deleteLogo() {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Logo>('logo')

    await collection.deleteMany({})
    return { success: true }
  } catch (error) {
    console.error('Error deleting logo:', error)
    throw error
  }
}
