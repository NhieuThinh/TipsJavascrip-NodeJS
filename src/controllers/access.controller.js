'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController{
    //version 1
    // handlerefreshtoken = async (req,res,next) =>{
    //     new SuccessResponse({
    //         message:'handle refreshtoken Successfully!',
    //         metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    //     }).send(res)
    // }

    //version 2
    handlerefreshtoken = async (req,res,next) =>{
        new SuccessResponse({
            message:'Get token Successfully!',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore:req.keyStore
            }),
        }).send(res)
    }

    login = async (req,res,next) =>{
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res)
    }

    logout = async (req,res,next) =>{
        new SuccessResponse({
            message:'Logout Successfully!',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res)
    }

    signUp = async (req, res, next) =>{
        // try {
        //     console.log(`[P]::signUp::`, req.body)
            // return res.status(201).json(await AccessService.signUp(req.body))
            new CREATED({
                message:'Registered OK!',
                metadata: await AccessService.signUp(req.body),
                options:{
                    limit:10
                }
            }).send(res)
        // } catch (error) {
        //     next(error)
        // }
    }

}

module.exports=new AccessController