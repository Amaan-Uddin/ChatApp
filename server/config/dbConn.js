const mongoose = require('mongoose')
const { mongodbURI } = require('./config.env')

const dbConnect = async () => {
	try {
		await mongoose.connect(mongodbURI)
		console.log('Connected to MongoDB')
	} catch (error) {
		console.error('Mongodb connection error :: ', error)
		process.exit(1)
	}
}

module.exports = dbConnect
