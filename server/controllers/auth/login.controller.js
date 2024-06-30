const bcrypt = require('bcrypt')
const { fetchUser, signAccessToken, signRefreshToken } = require('../../utils/index')

module.exports = async function loginHandler(req, res) {
	try {
		console.log('req.body = ', req.body)
		const { email, password } = req.body

		if (!email || !password) return res.status(400).json({ error: 'Bad request, some fields are missing.' })

		const user = await fetchUser(email)
		if (!user) return res.status(404).json({ error: 'Not found, user does not exist.' })

		const isMatch = await bcrypt.compare(password, user.password)
		console.log(isMatch)
		if (!isMatch) return res.status(401).json({ error: 'Unauthorized, incorrect email or password.' })

		const accessToken = signAccessToken({
			payload: { _id: user._id },
		})
		const refreshToken = await signRefreshToken({
			payload: { _id: user._id, email: user.email, name: user.name },
		})

		console.log(`accessToken: ${accessToken}\n\nRefreshToken: ${refreshToken}`)

		res.cookie('accessToken', accessToken, { httpOnly: true })
		res.cookie('refreshToken', refreshToken, { httpOnly: true })

		res.status(200).json({
			message: 'User logged in successfully.',
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
