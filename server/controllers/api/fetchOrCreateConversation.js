const Conversation = require('../../models/Conversation')
const findOrCreate = require('../../utils/functions/findOrCreate')

module.exports = async function fetchOrCreateConversation(req, res) {
	try {
		const { userId_1, userId_2 } = req.body
		if (!userId_1 || !userId_2) return res.status(400).json({ error: 'Bad request.' })
		const conversationDoc = await findOrCreate(
			Conversation,
			{
				participants: { $all: [userId_1, userId_2], $size: 2 },
			},
			{ participants: [userId_1, userId_2] }
		)
		console.log(conversationDoc)
		res.status(200).json({ conversationId: conversationDoc.doc })
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
