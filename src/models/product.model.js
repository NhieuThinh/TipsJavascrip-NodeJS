'use strict'

const {model, Schema, Types} = require('mongoose');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name:{type:String, required:true},
    product_thump:{type:String, required:true},
    product_description:String,
    product_price:{type:Number, required:true},
    product_quantity:{type:Number, required:true},
    product_type:{type:String, required:true, enum:['Electronics', 'Clothing', 'Furniture']},
    product_shop:String, //{Types.Schema.ObjectId, ref:'User},
    product_attributes:{type:Schema.Types.Mixed, required:true}
},{
    collection:COLLECTION_NAME,
    timestamps:true
})

// define product type: clothing
const clothingSchema = new Schema({
    brand:{type:String, required:true},
    size:String,
    material:String
},{
    collection:'clothes',
    timeseries:true
})

// define product type: clothing

const electronicSchema = new Schema({
    manufacturer:{type:String, required:true},
    model:String,
    color:String
},{
    collection:'electronics',
    timeseries:true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics',electronicSchema)
}