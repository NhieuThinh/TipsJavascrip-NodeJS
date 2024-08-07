'use strict'

// const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const {SuccessResponse} = require('../core/success.response')

class ProductController{
    // createProduct = async (req,res,next)=>{
    //     new SuccessResponse({
    //         message: 'Create Product successfully',
    //         metadata: await ProductService.createProduct(req.body.product_type,
    //             {
    //                 ...req.body,
    //                 product_shop:req.user.userId
    //             }
    //         )
    //     }).send(res)
    // }
    createProduct = async (req,res,next)=>{
        new SuccessResponse({
            message: 'Create Product successfully',
            metadata: await ProductServiceV2.createProduct(req.body.product_type,
                {
                    ...req.body,
                    product_shop:req.user.userId
                }
            )
        }).send(res)
    }
}

module.exports = new ProductController 