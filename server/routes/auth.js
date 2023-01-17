const express = require('express')
const router = express.Router()
const {signup,accountActivation,login,userForgotPassword,userResetPassword,googleLogin} = require('../controllers/signUp')

const {userSignupValidator,forgotPassword,resetPassword} = require('../validators/auth')
const {runValidation} = require('../validators/index')

router.post('/signup', userSignupValidator,runValidation, signup)
router.post('/account-activation', accountActivation)
router.post('/login',  login)
router.post('/forgot-password', forgotPassword,runValidation, userForgotPassword)
router.post('/reset-password',  userResetPassword)
router.post('/google-login',  googleLogin)

module.exports = router