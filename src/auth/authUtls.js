'use strict'

const JWT = require('jsonwebtoken')
const keyTokenService = require("../services/keyToken.service");
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) =>{
    try {
        //access token
        const accessToken = await JWT.sign( payload, publicKey,{
            expiresIn:'2 days'
        })
        const refreshToken = await JWT.sign( payload, privateKey,{
            expiresIn:'7 days'
        })

        JWT.verify( accessToken, publicKey, (err, decode) =>{
            if(err){
                console.log(`Error verify JWT::`, err)
            }else{
                console.log(`decode verify::`, decode)
            }
        })

        return {accessToken, refreshToken}

    } catch (error) {
        return error
    }
}
const authentication = asyncHandler( async(req,res,next)=>{
    /*
    1- check userid missing
    2- get accessToken
    3- verifyToken
    4- check user in dbs
    5- check keyStore with this userId
    6- Ok all -> return next
    */

    //1.
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId){
        throw new AuthFailureError('Invalid request')
    }
    //2. 
    const keyStore = await keyTokenService.findByUserId(userId)
    console.log(keyStore)
    if(!keyStore){
        throw new NotFoundError('Not Found KeyStore')
    }

    //3. 
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken){
        throw new AuthFailureError('Invalid request!')
    }
    try{
        const decodeUser = JWT.verify( accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId){
            throw new AuthFailureError('Invalid userID!')
        }
        req.keyStore=keyStore
        return next()
    }
    catch(error){
        throw error
    }
})

module.exports = {createTokenPair, authentication}