const express = require('express')
const app = express()

require('dotenv').config()
const { serverPort, allowedOrigins } = require('./config/config.env')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const dbConnect = require('./config/dbConn')

const authRouter = require('./routes/authRoute')

dbConnect()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const origins = allowedOrigins.split(',')
app.use(
	cors({
		origin: function (origin, callback) {
			if (origins.indexOf(origin) !== -1 || !origin) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		},
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	})
)

app.use('/auth', authRouter)

const PORT = serverPort || 4050
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')
	app.listen(PORT, () => {
		console.log(`Server running on port: ${PORT}`)
	})
})
