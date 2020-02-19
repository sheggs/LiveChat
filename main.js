const express = require('express');
const hbs = require('express-handlebars');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

const index = require('./routes/index');

//const mysql = require('mysql');


//const con = require('./router/connection');


//const session = require('express-session');
// app.use(session({
//     secret: 'sec',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { path:'/',
//     secure: false,
//     sameSite:true,
//     maxAge: 1000000 }})
// );

console.log("Test")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/', require('./routes/index'))

app.listen(81, () =>{
    console.log("Server Started");
})

//// Hiding real directory of my code. ////
app.use('/public',express.static(path.join(__dirname,'static')));
////////////////////// SETTING UP EXPRESS-HANDLE BARS ////////////////////////////////////////////
app.engine('hbs',hbs({extname: 'hbs', defaultLayout : 'layout', layoutsDir : __dirname + '/views/layout/'}));
app.set('views',path.join(__dirname,'views'));
app.set('views engine','hbs');
// app.use(session({secret:'max',saveUninitialized:false,resave:false}));

///////////////////////////////////////////////////////////////