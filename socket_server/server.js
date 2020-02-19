const socketIO = require('socket.io')(3000)

let x = []
// Everytime a user loads up the website
socketIO.on('connection', socket => {
    // Custom Network name
    socket.emit('chat-message', x)
    socket.on('send-message', message => {
        socket.broadcast.emit('chat-message',message)
    })
})