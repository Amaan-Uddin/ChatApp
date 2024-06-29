const jwt = require('jsonwebtoken')
const { privateAccessKey, privateRefreshKey } = require('../../config/config.env')

const signAccessToken = (payload) => {
	return jwt.sign(payload, privateAccessKey, { algorithm: 'RS256', expiresIn: '5m' })
}

const signRefreshToken = (payload) => {
	return jwt.sign(payload, privateRefreshKey, { algorithm: 'RS256', expiresIn: '7d' })
}

module.exports = { signAccessToken, signRefreshToken }
