import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

interface DecodedToken extends jwt.JwtPayload {
  userId: string
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string
        username: string
        fullname: string
        profilePic: string
        createdAt: Date
        updatedAt: Date
      }
    }
  }
}

const prisma = new PrismaClient()

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - no token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized - invalid token' })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: (decoded as DecodedToken).userId
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - user not found' })
    }

    req.user = user

    next()
  } catch (error: any) {
    console.log('Error in protectRoute middleware: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default protectRoute
