'use strict'

const mongoose = require('mongoose')
const connectString = `mongodb://localhost:27017/shopDEV`
const {countConnects} = require('../helpers/check.connect')

class Database{
    constructor(){
        this.connect()
    }
    //connect 
    connect(type = 'mongodb'){
        //dev 
        if(1===1){
            mongoose.set('debug', true)
            mongoose.set('debug',{color: true})
        }
        
        mongoose.connect(connectString,{maxPoolSize:50})
        .then(_=>console.log('Connect MOngodb Success PRO', countConnects()))
        .catch(err =>console.log('Error connecting! PRO'))
    }
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
