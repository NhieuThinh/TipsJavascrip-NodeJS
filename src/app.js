const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const helmet = require('helmet')
const app = express()


//init middleware
app.use(morgan('combined'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))


//init db
// require('./dbs/init.mongodb.lv0')
require('./dbs/init.mongodb')
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()



//routes
app.use('/', require('./routes'))

//handling erorr 
app.use((req,res,next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error, req,res,next)=>{
    const statusCode = error.status||500
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        message:error.message||'Internal Server Error'
    })
})

module.exports = app