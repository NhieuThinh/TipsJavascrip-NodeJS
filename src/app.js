const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')


//init middleware
app.use(morgan('combined'))
app.use(helmet())


//routes
app.get("/",(req, res, next)=>{
    res.status(200).json({message:'hello 500 ae'})
})

module.exports = app