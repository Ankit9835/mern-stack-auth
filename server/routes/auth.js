const express = require('express')
const router = express.Router()
const {signup,accountActivation} = require('../controllers/signUp')

const {userSignupValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')

router.post('/signup', userSignupValidator,runValidation, signup)
router.post('/account-activation', accountActivation)

module.exports = router