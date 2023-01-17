const { check } = require('express-validator');

exports.userSignupValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least  6 characters long')
];

exports.forgotPassword = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Please Enter Email'),
];

exports.resetPassword = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
];