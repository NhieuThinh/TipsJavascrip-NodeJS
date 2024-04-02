'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./access'))
// router.get("",(req, res, next)=>{
//     res.status(200).json({message:'hello 500 ae'})
// })

module.exports = router