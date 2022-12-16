const express = require("express");
const router = express.Router(); // #1 - Create a new express Router
const { Poster } = require("../models");
//  #2 Add a new route to the Express router
const { bootstrapField, createPosterForm } = require("../forms");

// to get all the posters collection
router.get("/", async (req, res) => {
  let posters = await Poster.collection().fetch();
  res.render("posters/index", {
    posters: posters.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  // inporting form setup
  const posterForm = createPosterForm();
  res.render("posters/create", {
    form: posterForm.toHTML(bootstrapField),
  });
});

module.exports = router; // #3 export out the router
