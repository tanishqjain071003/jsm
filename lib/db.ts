import clientPromise from './mongodb'
import { ObjectId } from 'mongodb'

export interface Car {
  _id?: string
  name: string
  brand: string
  year: number
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  transmission: 'Manual' | 'Automatic'
  mileage: number
  price: number
  description: string
  status: 'Available' | 'Sold'
  mainImage: string
  galleryImages: string[]
  noOfOwner: string
  color: string
  insuranceType: 'Comprehensive' | 'No insurance' | 'Third party' | 'Zero Dep'
  enginePower: number
  views: number
  createdAt: Date
  updatedAt: Date
}

export async function getCars(filter?: {
  search?: string
  maxPrice?: number
  year?: number
  fuelType?: string
  noOfOwner?: string
  status?: 'Available' | 'Sold' | '' | null
}) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Car>('cars')

    let query: any = {}

    // Only show available cars for public view if status filter is not specified
    // If status is explicitly empty string or null, show all cars (for admin)
    if (filter?.status === '' || filter?.status === null) {
      // Don't filter by status - show all cars
    } else if (filter?.status) {
      query.status = filter.status
    } else {
      // Default: show only available cars for public view
      query.status = 'Available'
    }

    if (filter?.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { brand: { $regex: filter.search, $options: 'i' } },
      ]
    }

    // Only maxPrice filter (minPrice removed)
    if (filter?.maxPrice) {
      query.price = { $lte: filter.maxPrice }
    }

    // Year filter: show cars from selected year and all years after (>=)
    if (filter?.year) {
      query.year = { $gte: filter.year }
    }

    if (filter?.fuelType) {
      query.fuelType = filter.fuelType
    }

    if (filter?.noOfOwner) {
      query.noOfOwner = { $regex: filter.noOfOwner, $options: 'i' }
    }

    const cars = await collection.find(query).sort({ createdAt: -1 }).toArray()
    return JSON.parse(JSON.stringify(cars))
  } catch (error) {
    console.error('Error fetching cars:', error)
    throw error
  }
}

export async function getCarById(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Car>('cars')

    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch {
      return null
    }

    const car = await collection.findOne({ _id: objectId as any })
    if (!car) return null

    // Increment views
    await collection.updateOne(
      { _id: objectId as any },
      { $inc: { views: 1 } }
    )

    return JSON.parse(JSON.stringify({ ...car, views: (car.views || 0) + 1 }))
  } catch (error) {
    console.error('Error fetching car:', error)
    throw error
  }
}

export async function createCar(carData: Omit<Car, '_id' | 'createdAt' | 'updatedAt' | 'views'>) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Car>('cars')

    const car: Car = {
      ...carData,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(car as any)
    return { ...car, _id: result.insertedId.toString() }
  } catch (error) {
    console.error('Error creating car:', error)
    throw error
  }
}

export async function updateCar(id: string, carData: Partial<Omit<Car, '_id' | 'createdAt' | 'views'>>) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Car>('cars')

    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch {
      throw new Error('Invalid car ID')
    }

    const updateData = {
      ...carData,
      updatedAt: new Date(),
    }

    await collection.updateOne(
      { _id: objectId as any },
      { $set: updateData }
    )

    return await getCarById(id)
  } catch (error) {
    console.error('Error updating car:', error)
    throw error
  }
}

export async function deleteCar(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection<Car>('cars')

    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch {
      throw new Error('Invalid car ID')
    }

    await collection.deleteOne({ _id: objectId as any })
    return { success: true }
  } catch (error) {
    console.error('Error deleting car:', error)
    throw error
  }
}