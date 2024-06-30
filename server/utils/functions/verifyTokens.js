const jwt = require('jsonwebtoken')
const { publicAccessKey, publicRefreshKey } = require('../../config/config.env')

function verifyAccessToken(access_token) {
	return jwt.verify(access_token, publicAccessKey, { algorithms: ['RS256'] })
}

function verifyRefreshToken(refresh_token) {
	return jwt.verify(refresh_token, publicRefreshKey, { algorithms: ['RS256'] })
}

module.exports = { verifyAccessToken, verifyRefreshToken }
