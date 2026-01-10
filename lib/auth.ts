import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-this'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function verifyPassword(password: string): Promise<boolean> {
  // For simplicity, we're using direct comparison
  // In production, you'd hash the password stored in env
  return password === ADMIN_PASSWORD
}

export function generateToken(): string {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get('admin_token')?.value || null
}

export function setAuthToken(response: NextResponse, token: string) {
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })
}

export function clearAuthToken(response: NextResponse) {
  response.cookies.delete('admin_token')
}