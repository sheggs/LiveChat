const express = require('express');
const hbs = require('express-handlebars');
const path = require('path')
const bodyParser = require('body-parser');
const router = require('express').Router();
const crypto = require('crypto')
///////////// Socket + Express ////////////

// Calling the socket io server. Already set up in main.js
const io = require('socket.io')
socketIO = io()

// Table to store all the users with their information [SESSION, SOCKET, PUBLIC ID]
let userTable = []

// To make calling users easier to call
class User {
    constructor(sessionid, socketid, pid) {
        this.sessionid = sessionid;
        this.socketid = socketid;
        this.pid = pid;
    }
}

// Adding users to the table. Ensuring no duplicates
function userAdd(sessionid, socket_id) {
    let found = false;
    for (let i = 0; i < userTable.length; i++) {
        if (userTable[i].session == sessionid) {
            // Update socket ID
            userTable[i].socket_id = socket_id
            found = true;
        }
    }
    if (!found) {
        let public_id = (crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex'));
        userTable.push({ socket_id: socket_id, session: sessionid, pid: public_id })
    }
}
// Get the user object by calling the session
function getUserBySession(session) {
    let obj = {};
    for (let i = 0; i < userTable.length; i++) {
        if (userTable[i].session = session) {
            obj = new User(userTable[i].session, userTable[i].socket_id, userTable[i].pid)
        }
    }
    return obj;
}
// function isUserExists(sessionid){
//     let found = false;
//     for(let i = 0; i<userTable.length;i++){
//         if(userTable[i].session == sessionid){
//             found = true;
//         }
//     }
//     if(found){
//         console.log("Found")
//     }else{
//         console.log("Not found")
//     }
// }


router.get('/', (req, res) => {
    console.log(userTable.length)
    for(let i = 0; i<userTable.length;i++){
        console.log(userTable[i].socket_id)
    }
    if (req.session.username == undefined) {
        res.render("login.hbs")
    } else {
        console.log("ID:" + req.session.id + " / USERNAME: " + req.session.username)
        res.render("index.hbs")
        // Everytime a user loads up the website
        
    }

})

console.log("A")
socketIO.on('connection', socket => {
    userAdd(req.session.id, socket.id)
    user_obj = getUserBySession(req.session.id);
    //console.log(user_obj.pid + ":" + req.session.id)
    socket.emit('public-id', user_obj.pid)
    socket.on('send-message', message => {
        socket.broadcast.emit('chat-message', message)
    })
})
router.get('/login', (req, res) => {
    res.render("login.hbs")
})
router.post('/login/submit', (req, res) => {
    let username = req.body.username;
    // req.session.id = usercount;
    // usercount = usercount + 1;
    req.session.username = username;
    req.session.save();
    res.redirect('/');
})
module.exports = router;