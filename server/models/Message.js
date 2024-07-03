const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		message: String,
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Message', MessageSchema)
