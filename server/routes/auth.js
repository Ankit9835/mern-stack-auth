const express = require('express')
const router = express.Router()
const {signup,accountActivation,login} = require('../controllers/signUp')

const {userSignupValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')

router.post('/signup', userSignupValidator,runValidation, signup)
router.post('/account-activation', accountActivation)
router.post('/login',  login)

module.exports = router