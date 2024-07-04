const Message = require('../../models/Message')

module.exports = async function fetchMessages(req, res) {
	try {
		const { recipient } = req.query
		const sender = req.user._id
		if (!recipient) return res.status(400).json({ error: 'Bad request, recipient is undefined.' })
		const allMessageDoc = await Message.find({
			$or: [
				{ sender: sender, recipient: recipient },
				{ sender: recipient, recipient: sender },
			],
		}).sort({ timestamp: 1 })
		if (allMessageDoc) {
			return res.status(200).json({ messages: allMessageDoc })
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
