const refreshAccessToken = require('../functions/refreahAccessToken')
const { verifyAccessToken } = require('../functions/verifyTokens')

module.exports = async function authenticateUser(req, res, next) {
	try {
		const accessToken = req.cookies?.accessToken
		// if (!accessToken) return res.status(401).json({ error: 'Unauthorized' })
		if (!accessToken) throw Object.assign(new Error('No access token'), { name: 'JsonWebTokenError' })
		const decode = verifyAccessToken(accessToken)
		console.log('AuthenticateUser :: accessToken :: ', decode)
		req.user = decode.payload
		next()
	} catch (error) {
		console.log(error)
		if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
			const refreshToken = req.cookies?.refreshToken
			if (!refreshToken) {
				return res.status(401).json({ error: 'Unauthorized (no refresh token).' })
			}
			try {
				const newAccessToken = await refreshAccessToken(refreshToken)
				const decode = verifyAccessToken(newAccessToken)
				console.log('AuthenticateUser :: new accessToken :: ', decode)
				res.cookie('accessToken', newAccessToken, { httpOnly: true })
				req.user = decode.payload
				next()
			} catch (error) {
				console.log(error)
				res.clearCookie('accessToken')
				res.clearCookie('refreshToken')
				return res.status(401).json({ error: 'Unauthorized (refresh failed).' })
			}
		} else {
			return res.status(500).json({ error: 'Internal server error.' })
		}
	}
}
