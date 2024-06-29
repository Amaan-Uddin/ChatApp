const bcrypt = require('bcrypt')
const User = require('../../models/User')
const { fetchUser, signAccessToken, signRefreshToken } = require('../../utils/index')

const signupHandler = async (req, res) => {
	try {
		console.log('req.body = ', req.body)
		const { name, email, password } = req.body

		if (!name || !email || !password)
			return res.status(400).json({ error: 'Bad request, some fields are missing.' })

		const user = await fetchUser(email)
		if (user) return res.status(409).json({ error: 'Conflict, user already exists.' })

		const hashPassword = await bcrypt.hash(password, 12)

		const newUser = await User.create({
			email: email,
			password: hashPassword,
			name: name,
		})
		console.log(newUser)

		const accessToken = signAccessToken({
			payload: { id: newUser._id },
		})
		const refreshToken = signRefreshToken({
			payload: { id: newUser._id, email: newUser.email, name: newUser.name },
		})

		console.log(`accessToken: ${accessToken}\n\nRefreshToken: ${refreshToken}`)

		res.cookie('accessToken', accessToken, { httpOnly: true })
		res.cookie('refreshToken', refreshToken, { httpOnly: true })

		res.status(201).json({
			message: 'User registered successfully',
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = signupHandler
