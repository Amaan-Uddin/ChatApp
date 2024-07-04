const express = require('express')
const http = require('http')
const ws = require('ws')
const app = express()

require('dotenv').config()
const { serverPort, allowedOrigins } = require('./config/config.env')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dbConnect = require('./config/dbConn')
const { getRefreshToken, Queue } = require('./utils/index')

const Message = require('./models/Message')

const authRouter = require('./routes/authRoute')
const apiRouter = require('./routes/apiRoute')

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
app.use('/api', apiRouter)

const PORT = serverPort || 4050
const server = http.createServer(app)
const wss = new ws.Server({ server })

const clients = new Map()
const messageQueues = new Map()

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

	socket.on('message', async (message) => {
		const data = JSON.parse(message.toString('utf-8'))
		const { recipient, content } = data.message
		if (recipient) {
			const recipientQueue = messageQueues.get(recipient) || new Queue()
			messageQueues.set(recipient, recipientQueue)

			recipientQueue.enqueue({ sender: socket._id, recipient, content, originalData: data })

			processQueue(recipient)
		} else {
			console.error('Recipient not specified in message:', data)
		}
	})

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

async function processQueue(recipient) {
	const queue = messageQueues.get(recipient)

	if (!queue || queue.isEmpty()) return

	const client = clients.get(recipient)

	if (!client || client.readyState !== ws.OPEN) {
		// logic to store messages when user offline
		while (!queue.isEmpty()) {
			const { sender, content, originalData } = queue.dequeue()
			try {
				await Message.create({
					sender,
					recipient,
					text: content,
					isUnsent: true,
				})
			} catch (error) {
				console.error('Error storing unsent message:', error)
			}
		}
		return
	}

	if (client.processingQueue) return // If already processing, exit the function

	client.processingQueue = true

	while (!queue.isEmpty()) {
		const { sender, content, originalData } = queue.dequeue()

		try {
			const doc = await Message.create({
				sender,
				recipient,
				text: content,
			})

			client.send(JSON.stringify({ ...originalData, messageId: doc._id }))
		} catch (error) {
			console.error('Error processing message:', error)
			queue.enqueue({ sender, recipient, content, originalData }) // Re-enqueue the message if there was an error
			break // Exit the loop and wait for the next opportunity to process the queue
		}
	}
	client.processingQueue = false
}

server.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`)
})
