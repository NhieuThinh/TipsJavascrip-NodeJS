"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;
//count connections
const countConnects = () => {
  const NumConnections = mongoose.connections.length;
  console.log(`Number of connections: ${NumConnections}`);
};

//check overload:
const checkOverload = () => {
  setInterval(() => {
    const NumConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number of cores
    const maxConnections = numCores*5;

    console.log(`Active connections: ${NumConnections}`)
    console.log(`Memory usage: ${memoryUsage/1024/1024} MB`)

    if(NumConnections>maxConnections){
        console.log(`connection overload detected`)
    }
    
  }, _SECOND); //monitor every 5 sec
};

module.exports = {
  countConnects,
  checkOverload
};
