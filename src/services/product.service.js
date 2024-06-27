'use strict'

const { BadRequestError } = require('../core/error.response')
const {product,clothing, electronic} = require('../models/product.model')

//define Factory to create product
class ProductFactory{
    static async createProduct(type, payload){

        switch(type){
            case 'Electronic':
                return new Electronic(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default: throw new BadRequestError(`Invalid Product Type ${type}`)
        }
    }
}


/*
    product_name:{type:String, required:true},
    product_thump:{type:String, required:true},
    product_description:String,
    product_price:{type:Number, required:true},
    product_quantity:{type:Number, required:true},
    product_type:{type:String, required:true, enum:['Electronics', 'Clothing', 'Furniture']},
    product_shop:String, //{Types.Schema.ObjectId, ref:'User},
    product_attributes:{type:Schema.Types.Mixed, required:true}
*/
//define base product class
class Product{
    constructor({
        product_name,product_thump, product_description, product_price,
        product_type, product_shop, product_attributes,product_quantity
    }){
        this.product_name        = product_name,
        this.product_thump       = product_thump,
        this.product_description = product_description,
        this.product_price       = product_price,
        this.product_type        = product_type,
        this.product_shop        = product_shop,
        this.product_attributes  = product_attributes,
        this.product_quantity    = product_quantity
                    
    }
    async createProduct(){
        return await product.create(this)
    }
}

//define sub-class for diffence product: Clothing
class Clothing extends Product{
    async createProduct(){

        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw BadRequestError('Error create new Clothing')

        const newProduct = await super.createProduct()
        if(!newProduct) throw BadRequestError('Error create new Product for Clothing')
        
        return newProduct
    }    
}

//define sub-class for diffence product: Electronic
class Electronic extends Product{
    async createProduct(){

        const newClothing = await electronic.create(this.product_attributes)
        if(!newClothing) throw BadRequestError('Error create new Electronic')

        const newProduct = await super.createProduct()
        if(!newProduct) throw BadRequestError('Error create new Product for Electronic')
        
        return newProduct
        
    }    
}

module.exports = ProductFactory