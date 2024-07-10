const User = require('../../models/User')

module.exports = async function fetchOfflineUsers(req, res) {
	try {
		const offlineUsers = await User.find({ isOnline: false }).select('_id email name')
		console.log(offlineUsers)
		res.status(200).json(offlineUsers)
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
