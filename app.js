const express = require("express");
const bodyParser = require("body-parser");
// const gig = require('./models/Gig');
const models = require('./models')
const pug = require("pug");
const path = require("path");
const accountRouter = require("./routes/account");
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
// get gigs
  data.gigs = await models.gig.findAll();
  res.render('gigs',data);
});
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
// Login page
app.use('/account', accountRouter);
app.use(
  session({
    secret: ' ',
    resave: false,
    saveUninitialized: true
  })
);
// app.get('/',bodyParser,onHomePageLoad,afterPageLoads);
// function onHomePageLoad(req,res){
//   res.render('index');
// }
app.get("/register", (req,res)=> {
  res.render('register');
});

app.get("/login", (req, res) => {
  let data = {};
  if (req.query.registeredSuccessfully) data.registeredSuccessfully = true;
  if (req.query.loggedOutSuccessfully) data.loggedOutSuccessfully = true;
  res.render("login", data);
});

app.get("/logout", (req, res) => {
  let data = {};
  req.session.destroy();
  res.redirect("/login?loggedOutSuccessfully=true");
});

app.post("/loginuser", async (req, res) => {
  try {
    // check user exists in db
    let userEmail = req.body.email
    let userPassword = req.body.password
    console.log("USER EMAIL: " + userEmail)
    console.log("USER PASSWORD: " + userPassword)

    let dbUser = await models.User.findOne({
      where: {
        email: userEmail,
      }
    });
    // documentation for express sessions 
    
    console.log("USER HEEeEEEEEEEEERE: ")
    console.log(dbUser)
    if (!dbUser) throw new Error("Login failed");

    if (dbUser.password == userPassword) {
      req.session.user_id = dbUser.id;
      res.redirect("/");
    }
  } catch (e) {
    res.send(e);
  }
});

app.post("/users", async (req, res) => {
  try {
    // check if email already exists
    let user = await db2.checkForUser(req.body.email);
    if (user) {
      throw new Error("Issue with email or password");
    }
    // encrypt password
    bcrypt.hash(req.body.password, 10, (err, encrypted) => {
      if (err) throw err;
      // post to database
      db2.createUser(req.body.email, encrypted);
      res.redirect("/login?registeredSuccessfully=true");
    });
  } catch (e) {
    res.send(e);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server start here ${PORT}`)); 