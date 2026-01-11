import clientPromise from './mongodb'

export interface ShopPhoto {
  _id?: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export async function getShopPhotos() {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<ShopPhoto>('shopPhotos')

    const photos = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return JSON.parse(JSON.stringify(photos))
  } catch (error) {
    console.error('Error fetching shop photos:', error)
    throw error
  }
}

export async function addShopPhoto(imageUrl: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<ShopPhoto>('shopPhotos')

    const photo: ShopPhoto = {
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(photo as any)
    return { ...photo, _id: result.insertedId.toString() }
  } catch (error) {
    console.error('Error adding shop photo:', error)
    throw error
  }
}

export async function deleteShopPhoto(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<ShopPhoto>('shopPhotos')
    const { ObjectId } = await import('mongodb')

    let objectId: any
    try {
      objectId = new ObjectId(id)
    } catch {
      throw new Error('Invalid photo ID')
    }

    await collection.deleteOne({ _id: objectId })
    return { success: true }
  } catch (error) {
    console.error('Error deleting shop photo:', error)
    throw error
  }
}
