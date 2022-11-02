const express = require('express')
const app = express();
const port = 3300
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/static', express.static(path.join(__dirname, 'public')))
const loginPage = fs.readFileSync('./public/login.html')
const registerPage = fs.readFileSync('./public/register.html')
const homePage = fs.readFileSync('./public/home.html')
app.get('/', (req,res)=>{
    res.writeHead(200,{ 'Content-Type': 'text/html'})
    res.end(homePage)
})
app.get('/login', (req,res)=>{
    res.writeHead(200,{ 'Content-Type': 'text/html'})
    // res.write()
    res.end(loginPage)
})
app.get('/register', (req,res)=>{
    res.writeHead(200,{ 'Content-Type': 'text/html'})
    // res.write()
    res.end(registerPage)
})
async function connect(){
    try {
        await mongoose.connect('mongodb://localhost:27017/f8_education_dev');
        console.log('Connect successful')
    } catch (error) {
        console.log('Loi')
    }
}
connect();
const Schema = mongoose.Schema;
const users = new Schema({
    email: String,
    username: String,
    pass: String,
    numberPhone: Number
})
const dataUser = mongoose.model('Users', users)

app.post('/register', (req,res)=>{
   var email = req.body.email
   var use = req.body.username
   var psw = req.body.pasw
   var numberPhone = req.body.numberPhone
   const user1 = new dataUser({email: email,username: use, pass: psw,numberPhone: numberPhone})
  dataUser.findOne({username: use}, (err,data)=>{
    if(data){
        res.status(500).json('User đã tồn tại')
    }
    else{
        user1.save();
        res.writeHead(200,{ 'Content-Type': 'text/html'})
        res.end(homePage)
    }
  })
   
})
app.post('/login',(req,res)=>{
    user= req.body.username
    psw = req.body.psw
    dataUser.findOne({
        username: user,
        pass: psw
    }, (err,data)=>{
        if(data){
            res.json('Dang nhap thanh cong')
            return;
        }
        res.writeHead(200,{ 'Content-Type': 'text/html'})
        res.end(loginPage)
    })

})
app.listen(port, ()=>{
    console.log(`Sever is running localhost:${port}/`)
})