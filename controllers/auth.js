const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
exports.register = (req,res)=>{
    console.log(req.body);
    // res.send('form submitted')
   
    
    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results)=>{
        if(error){
            console.log(error);
        }
        if(results.length>0) {
            return res.render('register', {message: 'Email id already exists'})
        }
        else if(password !== passwordConfirm) {
            return res.render('register', {message: 'Password do not match'});
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query('INSERT into users SET ?', {name: name, email: email, password: hashedPassword}, (error, results)=>{
            if(error) {
                console.log(error);
            }
            else{
                return res.render('register',{message:'Successfully Registered'})
            }
        })
    })


    // res.send("form submitted");
}

exports.login = (req, res)=>{
    const {email, password} = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results)=>{
        if(error){
            throw error;
        }

        if(results.length==0) {
            return res.render('login', {message: 'User do not exists, kindly register first'})
        }
        else {
            var hashedPassword = results[0].password;
            var response = bcrypt.compareSync(password, hashedPassword);

            if (response == false) {
                    return res.render('login',{message: 'Incorrect password'})
            } else {
                    return res.render('index')
            }
            console.log(results);
           
            
        }
        
    })
    
}