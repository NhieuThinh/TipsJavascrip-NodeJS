'use strict'

const express= require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtls')
const productController = require('../../controllers/product.controller')
const router = express.Router()

router.use(authentication)
router.post('/product', asyncHandler(productController.createProduct))
 
module.exports = router