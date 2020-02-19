const express = require('express');
const hbs = require('express-handlebars');
const path = require('path')
const bodyParser = require('body-parser');
const router = require('express').Router();
const crypto = require('crypto')
///////////// Socket + Express ////////////
const socketIO = require('socket.io')(3000)
// Socket ID Only lasts during the two way connection. Resets each time.
// Was in the middle of calling the userobject when a socket is made to retrieve the pid.
// 

// Here we can use node to store the user info in a cookie.

let userTable = []
let usercount = 0

class User {
    constructor(sessionid, socketid, pid){
        this.sessionid = sessionid;
        this.socketid = socketid;
        this.pid = pid;
    }
    get sessionid(){
        return this.sessionid
    }
    get socketid(){
        return this.socketid
    }
    get pid(){
        return this.pid
    }
}


function userAdd(sessionid,socket_id){
    let found = false;
    for(let i = 0; i<userTable.length ;i++){
        if(userTable[i].session == sessionid){
            // Update socket ID
            userTable[i].socket_id = socket_id
        }
    }
    if(!found){
        let public_id = (crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex'));
        userTable.push({socket_id: socket_id, session: sessionid, pid: public_id})
    }
}

function getUserBySession(session){
    let obj = {};
    for(let i = 0; i<userTable.length;i++){
        if(userTable[i].session = session){
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
    if (req.session.username == undefined) {
        res.render("login.hbs")
    } else {
        console.log("ID:" + req.session.id)
        console.log("USERNAME: " + req.session.username)
        res.render("index.hbs")
        // Everytime a user loads up the website
        socketIO.on('connection', socket => {
            userAdd(req.session.id, socket.id)
            let uesr_id
            socket.emit('public-id', x)
            socket.on('send-message', message => {
                socket.broadcast.emit('chat-message', message)
            })
        })
    }

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