const Token = require('../../models/Token')

module.exports = async function logoutHandler(req, res) {
	try {
		const refreshToken = req.cookies?.refreshToken
		if (!refreshToken) return res.status(401).json({ error: 'Unauthorized.' })

		const deletedToken = await Token.findOneAndDelete({ refreshToken: refreshToken })
		if (!deletedToken) throw new Error('Failed to logout.')
		res.clearCookie('accessToken')
		res.clearCookie('refreshToken')
		res.status(200).json({ message: 'Successfully logged out user.' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
