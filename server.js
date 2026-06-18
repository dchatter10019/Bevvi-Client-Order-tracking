import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const BEVVI_API_BASE = process.env.BEVVI_API_BASE_URL || 'https://api.getbevvi.com'

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3002' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'order-monitor-dashboard' })
})

app.get('/api/orders', async (req, res) => {
  try {
    const { client, numofdays, location } = req.query

    const params = new URLSearchParams()
    if (client) params.set('client', client)
    if (numofdays) params.set('numofdays', numofdays)
    if (location) params.set('location', location)

    const apiUrl = `${BEVVI_API_BASE}/api/corputil/getOrderHistory?${params.toString()}`
    const response = await axios.get(apiUrl, { timeout: 60000 })

    res.json({
      success: true,
      data: Array.isArray(response.data) ? response.data : [],
      apiUrl
    })
  } catch (error) {
    console.error('Order fetch error:', error.message)
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message || 'Failed to fetch orders'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Order Monitor API proxy running on http://localhost:${PORT}`)
})
