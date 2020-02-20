const socketIO = require('socket.io')(3000)
// Socket ID Only lasts during the two way connection. Resets each time.
const session = require('express-session');

const session_key = (session({
    secret: 'sec',
    resave: false,
    saveUninitialized: true,
    cookie: { path:'/',
    secure: false,
    sameSite:true,
    maxAge: 1000000 }})
);
// Here we can use node to store the user info in a cookie.

let x = []
// Everytime a user loads up the website
socketIO.on('connection', socket => {
    // Custom Network name
    console.log(socket.id)
    // socket.emit('chat-message', "")
    socket.on('send-message', message => {
        socket.broadcast.emit('chat-message',message)
    })
})
