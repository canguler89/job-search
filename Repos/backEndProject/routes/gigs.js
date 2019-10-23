const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Squelize = require('sequelize');
const Op = Squelize.Op;

// get gig list 
router.get('/',(req,res)=> 
    Gig.findAll()
        .then(gigs => res.render('gigs',{
                gigs
            }))
        .catch(err => console.log(err)));
    // display add gig form
router.get('/add', (req,res)=> res.render('add'));
// add a gig
router.post('/add',(req,res)=> {
    let {title,technologies,budget,description,contact_email} = req.body;
    let errors = [];

    if(!title){
        errors.push({text: 'Please add a title'})
    }
    if(!technologies){
        errors.push({text: 'Please add a technology'})
    }
    if(!description){
        errors.push({text: 'Please add a description'})
    }
    if(!contact_email){
        errors.push({text: 'Please add your email'})
    }
  
    // check errors
    if(errors.length >0){
        res.render('add', {
            errors, 
            title,
            technologies,
            budget,
            description,
            contact_email
        });
    }else{
        if(!budget){
            budget = 'Unknown';
        }else {
            budget = `$${budget}`;
        }
        // make lower case
        technologies = technologies.toLowerCase().replace(/, /g, ',');
        // insert into table
    Gig.create({
        title, 
        technologies,
        budget,
        description,
        contact_email
    })
        .then(gig => res.redirect('/gigs'))
        .catch(err => console.log(err));
    }
});

// search for gigs
router.get('/search', (req,res)=> {
    const {term} = req.query;
    Gig.findAll({ where: { technologies: { [Op.like]:'%'+ term +'%'}}})
    .then(gigs => res.render ('gigs', { gigs}))
    .catch(err => console.log(err));
})

module.exports = router;
  