const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../utils')
const { fetchMessages } = require('../controllers')

router.get('/messages', authenticateUser, fetchMessages)

module.exports = router
