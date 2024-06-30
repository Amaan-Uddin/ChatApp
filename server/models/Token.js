const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	refreshToken: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: process.env.REFRESH_TOKEN_MAX,
	},
})

module.exports = mongoose.model('Token', TokenSchema)
