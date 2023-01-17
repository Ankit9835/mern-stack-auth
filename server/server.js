const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const dbConfig = require("./config/dbConfig");
app.use(express.json())

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

app.use(morgan('dev'))

if(process.env.NODE_ENV === 'development'){
    app.use(cors({origin: 'http://localhost:3000'}))
}

app.use('/api',authRoutes)
app.use('/api',userRoutes)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server listening to ${port} no`)
})