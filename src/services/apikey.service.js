'use strict'

const apikeyModel  = require('../models/apikey.model')
const crypto = require('crypto')

// const newKey = apikeyModel.create({key:crypto.randomBytes(64).toString('hex'), permissions:['0000']})
// console.log(newKey)
const findById = async (key) =>{
    const objKey = await apikeyModel.findOne({key, status:true}).lean()
    return objKey
}

module.exports = {
    findById    
}