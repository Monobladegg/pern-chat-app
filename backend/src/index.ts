import express from 'express'
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()

const app = express()

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)

app.listen(5000, () => {
  console.log('Example app listening on port 5000!')
})