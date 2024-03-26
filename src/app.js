const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')


//init middleware
app.use(morgan('combined'))
app.use(helmet())


//init db
// require('./dbs/init.mongodb.lv0')
require('./dbs/init.mongodb')
const {checkOverload} = require('./helpers/check.connect')
checkOverload()



//routes
app.get("/",(req, res, next)=>{
    res.status(200).json({message:'hello 500 ae'})
})

module.exports = app