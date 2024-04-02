'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtls");
const { getInfoData } = require("../utils");

const RoleShop={
    SHOP: 'SHOP',
    WRITER:'WRITER',
    EDITOR: 'EDITOR',
    ADMIN:'ADMIN'
}

class AccessService{
    static signUp =async({name, email, password})=> {
        try {
            const holderShop  =await shopModel.findOne({email}).lean()

            if(holderShop){
                return {
                    code:'xxxx',
                    message: 'Shop already registerd'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({name, email, password:passwordHash, roles:[RoleShop.SHOP]})

            if(newShop){
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
                //     modulusLength:4096,
                //     publicKeyEncoding:{
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding:{
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })

                const privateKey  =crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({privateKey, publicKey})
                const keyStore = await keyTokenService.createKeyToken({
                    userId:newShop._id,
                    publicKey,
                    privateKey
                })
                if(!keyStore){
                    return {
                        code:'xxx',
                        message:'publicKeyString Error'
                    }
                }

                //created token pair
                const tokens = await createTokenPair({userId:newShop._id, email}, publicKey, privateKey)
                
                console.log(`created tokens successfully::`,tokens)
                return {
                    code:'201',
                    metadata:{
                        shop:getInfoData({fields:['_id', 'name', 'email'], object:newShop}),
                        tokens
                    }
                }
            }
            return {
                code:'200',
                metadata:null
            }

        } catch (error) {
            return{

                code:'xxx',
                message:error,
                status: 'error'
            }

        }
    }


}

module.exports = AccessService