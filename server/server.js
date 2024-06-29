const express = require('express')
const app = express()

require('dotenv').config()
const { serverPort } = require('./config/config.env')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const dbConnect = require('./config/dbConn')

const authRouter = require('./routes/authRoute')

dbConnect()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', authRouter)

const PORT = serverPort || 4050
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')
	app.listen(PORT, () => {
		console.log(`Server running on port: ${PORT}`)
	})
})
