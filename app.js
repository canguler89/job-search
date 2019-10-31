const express = require("express");
const bodyParser = require("body-parser");
const models = require('./models')
const pug = require("pug");
const path = require("path");
const session = require('express-session');
const bcrypt = require('bcrypt');
// database
const db = require('./config/database');
const db2 = require('./helpers/database');
const app = express();

// pug
app.set('view engine', 'pug');
// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// set static folder
app.use(express.static(path.join(__dirname, 'public')));
// index router
app.get('/',(req,res)=> res.render('index'));
// gigs render
app.get('/gigs', async(req,res)=> {
  let data = {};
  data.gigs = await models.gig.findAll();
  res.render('gigs',data);
});
// session
app.use(
  session({
    secret:'sadada',
    resave:false,
    saveUninitialized:true
  })
);


// testing db
db.authenticate()
  .then(() => {
    console.log('Connection successful.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Gig routes 
app.use('/gigs', require('./routes/gigs'));
// login 
app.get('/login', (req,res)=>{
  res.render('login');
});
app.post('/login', (req,res)=> {
  console.log('logged in successfully!');
  res.render('account');
});
app.get('/register',(req,res)=>  {
  res.render('register')
});
app.post('/users',(req,res)=> {
  let user = models.User.build({
    email:req.body.email,
    password:req.body.password
  })
  user.save().then( () => {
  res.redirect('/login')
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server start here ${PORT}`));