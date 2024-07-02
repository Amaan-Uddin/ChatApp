const express = require('express')
const http = require('http')
const ws = require('ws')
const app = express()

require('dotenv').config()
const { serverPort, allowedOrigins } = require('./config/config.env')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const dbConnect = require('./config/dbConn')
const { getRefreshToken } = require('./utils/index')

const authRouter = require('./routes/authRoute')
const { verifyRefreshToken } = require('./utils/functions/verifyTokens')

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
const server = http.createServer(app)
const wss = new ws.Server({ server })

const clients = new Map()
wss.on('connection', (socket, req) => {
	const cookie = req.headers.cookie
	if (cookie) {
		const refreshToken = getRefreshToken(cookie)
		if (refreshToken) {
			const decode = verifyRefreshToken(refreshToken)
			console.log(decode)
			socket._id = decode.payload._id
			socket.email = decode.payload.email
			socket.name = decode.payload.name
			if (!clients.has(socket._id)) {
				clients.set(socket._id, socket)
				broadCastOnlineUsers()
			}
		} else {
			console.log('Refresh token not found in cookies')
			socket.send(JSON.stringify({ error: 'Unauthorized: Refresh token not found' }))
			socket.close()
		}
	} else {
		console.log('No cookies found')
		socket.send(JSON.stringify({ error: 'Unauthorized: No cookies found' }))
		socket.close()
	}

	socket.on('close', () => {
		console.log('Client disconnected.')
		clients.delete(socket._id)
		broadCastOnlineUsers()
	})

	socket.on('error', (error) => {
		console.error('WebSocket error: ', error)
	})
})

function broadCastOnlineUsers() {
	const onlineUsers = [...clients.values()]
		.filter((client) => client.readyState === ws.OPEN)
		.map((client) => ({ _id: client._id, name: client.name, email: client.email }))

	clients.forEach((client) => {
		if (client.readyState === ws.OPEN) {
			client.send(JSON.stringify({ type: 'online', users: onlineUsers }))
		}
	})
	console.log([...clients.values()].map((client) => ({ name: client.name, email: client.email })))
}
server.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`)
})
