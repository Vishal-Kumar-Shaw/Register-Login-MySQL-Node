// all the main thhings
const express = require('express');
const app = express();


const mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


const path = require('path');
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.set("view engine",'hbs');


db.connect((err)=>{
    if(err) throw err;
    else console.log('database conencted');
})

// app.get("/", (req,res)=>{
//     // res.send("<h1>Hello</h1>")
//     res.render("index.hbs")
// })
// app.get("/register", (req,res)=>{
//     // res.send("<h1>Hello</h1>")
//     res.render("register.hbs")
// })

// define routes in organized manner
app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/auth'))
app.listen(5000, ()=>{
    console.log('server started on port 5000');
})
