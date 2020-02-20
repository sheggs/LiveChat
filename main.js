const express = require('express');
const hbs = require('express-handlebars');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const session = require('express-session');
const memorystore = require('memorystore')(session)
const index = require('./routes/index');
//const connect = require('connect')
const socketIO = require('socket.io')(3000);
// Socket ID Only lasts during the two way connection. Resets each time.
function getSID(string) {
    let cookie_id = undefined
    let split = string.split(';')
    if ((split[0].substr(0, 11)) == "connect.sid") {
        cookie_id = split[0].substr(12)
    }
    return (cookie_id)
}
let session_storage = new memorystore();
const session_key = (session({
    secret: 'sec',
    store: session_storage,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        secure: false,
        sameSite: true,
        maxAge: 1000000
    }
})
);
// Here we can use node to store the user info in a cookie.

let x = []
// Everytime a user loads up the website
socketIO.on('connection', socket => {
    // Custom Network name
    console.log(socket.id)
    var cookie_string = socket.request.headers.cookie;
    let sid = getSID(cookie_string)
    if (sid != undefined) {
        session_storage.get(sid, function (error, session) {
            // console.log("___")
            // console.log(session_storage.store)
            // console.log(session)
            // console.log(error)
        });
    }
    console.log(cookie_string)
    //console.log(socket.)
    // socket.emit('chat-message', "")
    socket.on('send-message', message => {
        socket.broadcast.emit('chat-message', message)
    })
})



// const socketIO = require('socket.io')(3000)

let sessMiddleware = session({
    secret: 'sec',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        secure: false,
        sameSite: true,
        maxAge: 1000000
    }
})


// socketIO.use((socket,next) => {
//     sessMiddleware(socket.request,socket.request.res,next);
// })
app.use(session_key);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', require('./routes/index'))

app.listen(81, () => {
    console.log("Server Started");
})

//// Hiding real directory of my code. ////
app.use('/public', express.static(path.join(__dirname, 'static')));
////////////////////// SETTING UP EXPRESS-HANDLE BARS ////////////////////////////////////////////
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'hbs');
// app.use(session({secret:'max',saveUninitialized:false,resave:false}));

///////////////////////////////////////////////////////////////
// exports.socketIO = socketIO;

