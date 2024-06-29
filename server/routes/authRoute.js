const express = require('express')
const router = express.Router()
const signupHandler = require('../controllers/auth/signup.controller')

router.post('/signup', signupHandler)
router.post('/login')

module.exports = router
