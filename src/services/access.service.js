'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair, verifyToken } = require("../auth/authUtls");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const KeyTokenModel = require("../models/keytoken.model");
const { keys } = require("lodash");

const RoleShop={
    SHOP: 'SHOP',
    WRITER:'WRITER',
    EDITOR: 'EDITOR',
    ADMIN:'ADMIN'
}

class AccessService{

    /*
    Check this token used?????
    */

    static handlerRefreshTokenV2 = async ({keyStore, user, refreshToken})=>{

        const {userId, email} = user

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend with your account! Please login again')
        }

        //check email coi co khong
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new AuthFailureError('Shop not register -2!')
        }

        //tim thay shop thi tao cap token moi cho shop
        const tokens = await createTokenPair({userId:foundShop._id, email}, keyStore.publicKey, keyStore.privateKey)


        //update token cho shop
        console.log(keyStore._id)
        // await keyStore.update({
        //     $set: {
        //       refreshToken: tokens.refreshToken
        //     },
        //     $addToSet: {
        //       refreshTokensUsed: refreshToken
        //     }
        //   });

        keyStore.refreshToken = tokens.refreshToken;
        keyStore.refreshTokensUsed.addToSet(refreshToken);
        await keyStore.save();

        return {
            user,
            tokens
        }
    }


    static handlerRefreshToken = async (refreshToken)=>{
        // check coi RT co trong list da su dung khong
        const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken)
        // neu co thi co van de, decode xem coi la thang nao
        if(foundToken){
            const {userId, email} = await verifyToken(refreshToken, foundToken.privateKey)
            console.log({userId, email})
            //co van de nen xoa luon bo token trong keytokenModel
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend with your account! Please login again')
        }
        // neu khong thi qua tot, tim xem coi no dang la RT cua thang nao
        const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
        // neu van khong tim thay thi dua ra loi~
        if(!holderToken){
            throw new AuthFailureError('Shop not register -1!')
        }

        //neu tim thay thi verify token 
        const {userId, email} = await verifyToken(refreshToken, holderToken.privateKey)
        console.log('[2]--',{userId ,email})

        //check email coi co khong
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new AuthFailureError('Shop not register -2!')
        }
        //tim thay shop thi tao cap token moi cho shop
        const tokens = await createTokenPair({userId:foundShop._id, email}, holderToken.publicKey, holderToken.privateKey)

        //update token cho shop
        await KeyTokenModel.updateOne({ _id: holderToken._id }, {
            $set: {
              refreshToken: tokens.refreshToken
            },
            $addToSet: {
              refreshTokensUsed: refreshToken
            }
          });

        return {
            user: {userId, email},
            tokens
        }


    }

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