const jwt = require('jsonwebtoken')
const Token = require('../../models/Token')
const { privateAccessKey, privateRefreshKey } = require('../../config/config.env')
const findOrCreate = require('./findOrCreate')

const signAccessToken = (payload) => {
	return jwt.sign(payload, privateAccessKey, { algorithm: 'RS256', expiresIn: process.env.ACCESS_TOKEN_MAX })
}

const signRefreshToken = async (payload) => {
	const refreshToken = jwt.sign(payload, privateRefreshKey, {
		algorithm: 'RS256',
		expiresIn: process.env.REFRESH_TOKEN_MAX,
	})

	const { doc, isNew } = await findOrCreate(
		Token,
		{ userId: payload.payload._id },
		{ refreshToken: refreshToken, userId: payload.payload._id }
	)

	console.log('SignRefreshToken :: doc :: ', doc)
	console.log('SignRefreshToken :: isNew :: ', isNew)

	if (!isNew) await Token.updateOne({ _id: doc._id }, { refreshToken: refreshToken })

	return refreshToken
}

module.exports = { signAccessToken, signRefreshToken }
