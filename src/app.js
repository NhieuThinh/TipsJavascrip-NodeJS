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

module.exports = app