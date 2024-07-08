'use strict'

const { BadRequestError } = require('../core/error.response')
const {product,clothing, electronic, furniture} = require('../models/product.model')

//define Factory to create product
class ProductFactory{

    static productRegistry = {}

    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type]=classRef
    }

    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        
        return new productClass(payload).createProduct()
    }
}


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
    async createProduct(product_id){
        return await product.create({...this, _id:product_id})
    }
}

//define sub-class for diffence product: Clothing
class Clothing extends Product{
    async createProduct(){

        const newClothing = await clothing.create({...this.product_attributes, product_shop:this.product_shop})
        if(!newClothing) throw new BadRequestError('Error create new Clothing')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Error create new Product for Clothing')
        
        return newProduct
    }    
}

//define sub-class for diffence product: Electronic
class Electronics extends Product{
    async createProduct(){

        const newElectronic = await electronic.create({...this.product_attributes, product_shop:this.product_shop})
        if(!newElectronic) throw new BadRequestError('Error create new Electronic')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Error create new Product for Electronic')
        
        return newProduct
        
    }    
}


//define sub-class for diffence product: Furniture
class Furniture extends Product{
    async createProduct(){

        const newFurniture = await furniture.create({...this.product_attributes, product_shop:this.product_shop})
        if(!newFurniture) throw new BadRequestError('Error create new Furniture')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Error create new Product for Furniture')
        
        return newProduct
    }    
}

//register new product type:
ProductFactory.registerProductType('Electronic', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)



module.exports = ProductFactory