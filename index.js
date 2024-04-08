const express = require("express");
const bodyparser = require("body-parser");
const server = express();
const path = require('path')
const nodemon = require('nodemon');
const cookieParser = require('cookie-parser')

server.set('view engine','ejs');
server.use(bodyparser.urlencoded({extended:true}));

const db = require('./Database/database')
const routes = require('./routes/route');

server.use(cookieParser());
server.use(express.static(path.join(__dirname, '/public')));
server.use('/',routes);
server.use('/views/uploads', express.static('./views/uploads'));

// console.log(path.join(__dirname, '/public'));

db
console.log();

server.listen('4000',(req,res) => {
    // res.send("fcgvbhnj")
        
})