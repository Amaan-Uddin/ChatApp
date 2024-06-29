const User = require('../../models/User')
module.exports = async function fetchUser(query) {
	return await User.findOne({ email: query }).select('_id email password')
}
