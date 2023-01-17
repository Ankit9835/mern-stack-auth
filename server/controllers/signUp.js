const User = require("../models/User");
const newjwt = require("jsonwebtoken");
const { expressjwt: jwt } = require("express-jwt");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");
const sendEmail = require("./sendEmail");
const { OAuth2Client } = require("google-auth-library");
const { use } = require("../routes/auth");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return res.status(422).json({
        error: "Email already exists",
      });
    }
    const token = newjwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

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
      subject: "Email Confirmation",
      html: `
                    <h1>Please use the following link to activate your account</h1>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
    });
    res.status(200).json({
      message: `Email has been sent to the ${email} user, please check the email for activating your account`,
    });
  } catch (err) {
    return res.status(404).json({
      error: err.message,
    });
  }
};

exports.accountActivation = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(404).json({
        error: "Token is required",
      });
    }

    const verify = newjwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    if (!verify) {
      return res.status(404).json({
        error: "Email link expired,please sign up again",
      });
    }

    const { name, email, password } = newjwt.decode(token);
    console.log(name, email, password);
    const user = await User.create({ name, email, password });
    if (user) {
      return res.status(200).json({
        message: "Sign up successfully, sign in to access dashboard",
      });
    } else {
      return res.status(404).json({
        error: "Something went wrong",
      });
    }
  } catch (err) {
    return res.status(404).json({
      error: err.message,
    });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }
    // generate a token and send to client
    const token = newjwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
      message: `Hey ${name} Welcome Back!`,
    });
  });
};

exports.requireSignin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.auth._id });
    if (user.role != "admin") {
      return res.status(402).json({
        message: "Access Unauthorized",
      });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.json({
      error: err.message,
    });
  }
};

exports.userForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(402).json({
        error: `Please provide email`,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(402).json({
        error: `This ${email} not found,please try again`,
      });
    }
    const token = newjwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_FORGOT_PASSWORD,
      { expiresIn: "2m" }
    );
    console.log(token);
    user.resetPasswordLink = token;
    const resetPasswordLink = await user.save();
    console.log(resetPasswordLink);
    if (resetPasswordLink) {
      await sendEmail({
        to: email,
        subject: "Reset Password Link",
        html: `
                            <h1>Please use the following link to reset your password</h1>
                            <p>${process.env.CLIENT_URL}/auth/reset-password/${token}</p>
                            <hr />
                            <p>This email may contain sensetive information</p>
                            <p>${process.env.CLIENT_URL}</p>
                        `,
      });
      res.status(200).json({
        message: `Email has been sent to the ${email} user, please check the email for reseting the password`,
      });
    }
  } catch (err) {
    return res.json({
      error: err.message,
    });
  }
};

exports.userResetPassword = async (req, res) => {
  try {
    const { resetPasswordLink, newPassword } = req.body;
    console.log(resetPasswordLink);
    if (!resetPasswordLink || !newPassword) {
      return res.status(402).json({
        error: "All values will be filled",
      });
    }
    const user = await User.findOne({ resetPasswordLink });
    console.log(user);
    if (!user) {
      return res.status(402).json({
        error: "User not found with the given password link",
      });
    }
    const verify = newjwt.verify(
      resetPasswordLink,
      process.env.JWT_FORGOT_PASSWORD
    );

    if (verify) {
      user.password = newPassword;
      user.resetPasswordLink = "";
      await user.save();
      res.status(200).json({
        message: "Great! Now you can login with your new password",
      });
    } else {
      return res.status(402).json({
        error: "Link Expired,Try Again",
      });
    }
  } catch (err) {
    return res.status(402).json({
      error: err.message,
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_AUTH_KEY);
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  const response = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_AUTH_KEY,
  });
  //console.log(response.payload)
  const { email_verified, name, email } = response.payload;
  if (email_verified) {
    const user = await User.findOne({ email });
    console.log(user)
    if (user) {
      const token = newjwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const { _id, email, name, role } = user;
      return res.json({
        token,
        user: { _id, email, name, role },
      });
    } else {
        let password = email + process.env.JWT_SECRET
        const newUser = await User.create({name,email,password})
        console.log(newUser)
        if(newUser){
            const token = newjwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const { _id, email, name, role } = newUser;
            return res.json({
                token,
                user: { _id, email, name, role }
            });
        }
    }
  } else {
        return res.status(400).json({
            error: 'Google login failed. Try again'
        });
  }
};
