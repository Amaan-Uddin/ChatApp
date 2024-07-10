const signupHandler = require('./auth/signup.controller')
const loginHandler = require('./auth/login.controller')
const fetchMessages = require('./api/fetchMessages')
const fetchOfflineUsers = require('./api/fetchOfflineUsers')
const fetchOrCreateConversation = require('./api/fetchOrCreateConversation')
const logoutHandler = require('./auth/logout.controller')

module.exports = {
	signupHandler,
	loginHandler,
	fetchMessages,
	fetchOfflineUsers,
	fetchOrCreateConversation,
	logoutHandler,
}
