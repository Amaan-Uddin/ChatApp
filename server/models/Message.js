const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Conversation',
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},
		text: String,
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Message', MessageSchema)
