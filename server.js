const app = require('./src/app')

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, ()=>{
    console.log(`WSV is starting on ${PORT}`)
})

// process.on('SIGINT', ()=>{
//     server.close(()=>{
//         console.log('WSV is exit')
//     })
// })