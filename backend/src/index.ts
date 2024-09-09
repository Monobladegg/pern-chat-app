import express from 'express'
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()

const PORT = process.env.PORT || 5001

const app = express()

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})