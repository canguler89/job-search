const express = require("express");
const router = express.Router();
const db2 = require("../helpers/database");

function checkIsLoggedIn(req, res, next) {
  if (req.session.user_id) {
    next();
  } else {
    res.redirect("/login");
  }
}
router.use(checkIsLoggedIn);

router.get("/", (req, res) => {
  res.render("gigs");
});

module.exports = router;