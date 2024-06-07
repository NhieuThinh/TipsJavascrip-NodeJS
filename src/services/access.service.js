'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtls");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop={
    SHOP: 'SHOP',
    WRITER:'WRITER',
    EDITOR: 'EDITOR',
    ADMIN:'ADMIN'
}

class AccessService{

    static logout = async (keyStore)=>{
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        console.log({delKey})
        return delKey
    }

    /*
        1- check email in dbs
        2- match password
        3- create AT and RT sand save
        4- generate Tokens
        5- get data return login
    */
    static login = async({email, password, refreshToken = null}) =>{
        //1.
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Shop not registered!')

        //2.
        const matchPassword = await bcrypt.compare(password, foundShop.password)
        if(!matchPassword) throw new AuthFailureError('Authentication Error!')
        
        //3.
        const privateKey  =crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        //4.
        const tokens = await createTokenPair({userId:foundShop._id, email}, publicKey, privateKey)
        await keyTokenService.createKeyToken({
            userId:foundShop._id,refreshToken: tokens.refreshToken, publicKey, privateKey
        })
        return {
            shop:getInfoData({fields:['_id', 'name', 'email'], object:foundShop}),
            tokens
        }
    }

    static signUp =async({name, email, password})=> {
        // try {
            const holderShop  =await shopModel.findOne({email}).lean()

            if(holderShop){
                // return {
                //     code:'xxxx',
                //     message: 'Shop already registerd'
                // }
                throw new BadRequestError('Error Shop already registerd')
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
                    // throw new BadRequestError('Error: publicKeyString not existed')

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

        // } catch (error) {
        //     return{
        //         code:'xxx',
        //         message:error,
        //         status: 'error'
        //     }
        // }
    }


}

module.exports = AccessService