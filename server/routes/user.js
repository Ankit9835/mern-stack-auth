const express = require('express')
const router = express.Router()
const {singleUser,updateUser} = require('../controllers/user')

const {requireSignin, adminMiddleware} = require('../controllers/signUp')
router.get('/user/:id',requireSignin, singleUser)
router.put('/user/update',requireSignin, updateUser)
router.put('/admin/update',requireSignin,adminMiddleware, updateUser)

module.exports = router