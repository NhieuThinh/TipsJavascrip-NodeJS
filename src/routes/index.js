'use strict'

const express = require('express')
const {apiKey, permission} = require('../auth/checkAuth')
const router = express.Router()

//check api key
router.use(apiKey)
//check permission
router.use(permission('0000'))

router.use('/v1/api', require('./access'))
// router.get("",(req, res, next)=>{
//     res.status(200).json({message:'hello 500 ae'})
// })

router.use('/v1/api', require('./product'))

module.exports = router