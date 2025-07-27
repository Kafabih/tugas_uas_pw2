import * as dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || '4000'
export const DATABASE_URL = process.env.DATABASE_URL || ''
export const JWT_SECRET = process.env.JWT_SECRET || ''

if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL in .env')
}

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in .env')
}