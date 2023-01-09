const User = require('../models/User')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');
const sendEmail = require('./sendEmail');

exports.signup = async (req,res) => {
    try{
        const {name,email,password} = req.body
            const isEmailExists = await User.findOne({email})
            if(isEmailExists){
                return res.status(422).json({
                    error:'Email already exists'
                })
            }
            const token = jwt.sign({name,email,password},  process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })

        //     const emailData = {
        //         from: process.env.EMAIL_FROM,
        //         to: email,
        //         subject: `Account activation link`,
        //         html: `
        //             <h1>Please use the following link to activate your account</h1>
        //             <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
        //             <hr />
        //             <p>This email may contain sensetive information</p>
        //             <p>${process.env.CLIENT_URL}</p>
        //         `
        //     };

        // const sendEmail =  await sgMail.send(emailData)
        // if(sendEmail){
        //     return res.status(200).json({
        //         message:'Email sent successfully'
        //     })
        // } else {
        //     return res.status(500).json({
        //         message:'Something went wrong'
        //     })
        // }

        await sendEmail({
            to: email,
            subject: 'Email Confirmation',
            html: `
                    <h1>Please use the following link to activate your account</h1>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
          });
          res.status(200).json({
            message:'Email sent'
          })
         
    } catch(err){
        return res.status(404).json({
            error:err.message
        })
    }
    

}

exports.accountActivation = async (req,res) => {
    try{
            const {token} = req.body
            if(!token){
                return res.status(404).json({
                    error:'Token is required'
                })
            }

            const verify = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION)
            if(!verify){
                return res.status(404).json({
                    error:'Email link expired,please sign up again'
                })
            }
           
            const {name,email,password} = jwt.decode(token);
            console.log(name,email,password)
            const user = await User.create({name,email,password})
            if(user){
                return res.status(200).json({
                    message:'Sign up successfully, sign in to access dashboard'
                })
            } else {
                return res.status(404).json({
                    error:'Something went wrong'
                })
            }
    } catch(err){
        return res.status(404).json({
            error: err.message
        })
    }
    
}