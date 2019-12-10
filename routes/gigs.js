const express = require("express");
const router = express.Router();
const Gig = require("../models/Gig");
const models = require("../models");
const Squelize = require("sequelize");
const Op = Squelize.Op;
const user = require("../models/user");

// Display add gig form
router.get("/add", (req, res) => {
  let errors = [];
  let data = {};
  data.errors = errors;
  res.render("add", data);
});

// Add a gig
router.post("/add", (req, res) => {
  //let { title, technologies, budget, description, contact_email } = req.body;
  let title = req.body.title;
  let technologies = req.body.technologies;
  let budget = req.body.budget;
  let description = req.body.description;
  let contact_email = req.body.contact_email;
  let data = {};
  let errors = [];
  // Validate Fields
  if (!title) {
    errors.push("Please add a title");
  }
  if (!technologies) {
    errors.push("Please add some technologies");
  }
  if (!description) {
    errors.push("Please add a description");
  }
  if (!contact_email) {
    errors.push("Please add a contact email");
  }

  data.errors = errors;

  if (errors.length > 0) {
    res.render("add", data);
  } else {
    if (!budget) {
      budget = "Unknown";
    } else {
      budget = `$${budget}`;
    }

    // Make lowercase and remove space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ",");

    // Insert into table
    models.gig
      .create({
        title,
        technologies,
        description,
        budget,
        contact_email
      })
      .then(gig => res.redirect("/gigs"))
      .catch(err => console.log(err));
  }
});

// Search for gigs
router.get("/search", (req, res) => {
  let { term } = req.query;

  // Make lowercase
  term = term.toLowerCase();

  models.gig
    .findAll({ where: { technologies: { [Op.like]: "%" + term + "%" } } })
    .then(gigs => res.render("gigs", { gigs: gigs }))
    .catch(err => console.log(err));
});

module.exports = router;
