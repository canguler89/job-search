const express = require("express");
const bodyParser = require("body-parser");
const pug = require("pug");
const path = require("path");
// database
const db = require('./config/database');
const app = express();

// pug
app.set('view engine', 'pug');

// body parser
app.use(bodyParser.urlencoded({extended: false}));
// set static folder
app.use(express.static(path.join(__dirname, 'public')));
// index router
app.get('/',(req,res)=> res.render('index'));


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
   
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server start here ${PORT}`)); 