const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../utils')
const { fetchMessages, fetchOfflineUsers, fetchOrCreateConversation } = require('../controllers')

router.get('/messages', authenticateUser, fetchMessages)
router.get('/offline', authenticateUser, fetchOfflineUsers)

router.post('/set-conversation', authenticateUser, fetchOrCreateConversation)
module.exports = router
