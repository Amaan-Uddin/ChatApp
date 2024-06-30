const User = require('../../models/User')

async function fetchUser(query) {
	return await User.findOne({ email: query }).select('_id email password name')
}

async function createUser(data) {
	return await User.create({
		email: data.email,
		password: data.password,
		name: data.name,
	})
}

module.exports = {
	fetchUser,
	createUser,
}
