const Message = require('../../models/Message')

module.exports = async function fetchMessages(req, res) {
	try {
		// const { recipient } = req.query
		const { conversationId } = req.query
		const sender = req.user._id
		if (!conversationId) return res.status(400).json({ error: 'Bad request, conversation is undefined.' })
		// const allMessageDoc = await Message.find({
		// 	$or: [
		// 		{ sender: sender, recipient: recipient },
		// 		{ sender: recipient, recipient: sender },
		// 	],
		// })
		const allMessageDoc = await Message.find({ conversationId: conversationId }).sort({ createdAt: 1 }).lean()
		if (allMessageDoc) {
			return res.status(200).json({ messages: allMessageDoc })
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
