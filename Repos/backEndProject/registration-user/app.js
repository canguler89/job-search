const express = require('express');
const session = require('express-session');
const path = require('path');
const router = require('./routes/pages');
const app = express();

// for bodyParser
app.use(express.urlencoded({extended:false}));

// static files
app.use(express.static(path.join(__dirname,"public")));

// pug
app.set('view engine', 'pug');
// session
app.use(session({
    secret:'Software_jobs',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 60*1000*30
    }
}));

// router
app.use('/',router);
// error or 404
app.use((req,res,next)=> {
    var err = new Error('Page not available');
    err.status = 404;
    next(err);
})

app.listen(3001,()=> {
    console.log(`server is runnin...`);
})
module.exports = app;