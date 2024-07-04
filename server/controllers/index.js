const signupHandler = require('./auth/signup.controller')
const loginHandler = require('./auth/login.controller')
const fetchMessages = require('./api/fetchMessages')

module.exports = {
	signupHandler,
	loginHandler,
	fetchMessages,
}
