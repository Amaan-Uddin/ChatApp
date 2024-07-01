const express = require('express')
const router = express.Router()
const { signupHandler, loginHandler } = require('../controllers/index')
const { authenticateUser } = require('../utils/index')

router.post('/signup', signupHandler)
router.post('/login', loginHandler)
router.get('/current-user', authenticateUser, (req, res) => {
	if (req.user) return res.status(200).json(req.user)
	else return res.status(401).json({ error: 'Unauthorized...' })
})
module.exports = router
