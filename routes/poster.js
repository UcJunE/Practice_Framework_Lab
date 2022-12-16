const express = require("express");
const router = express.Router(); // #1 - Create a new express Router
const { Poster } = require("../models");
//  #2 Add a new route to the Express router
const { bootstrapField, createPosterForm } = require("../forms");
const async = require("hbs/lib/async");

// to get all the posters collection
router.get("/", async (req, res) => {
  let posters = await Poster.collection().fetch();
  res.render("posters/index", {
    posters: posters.toJSON(),
  });
});

//to display the form
router.get("/create", async (req, res) => {
  console.log("get create");
  // inporting form setup
  const posterForm = createPosterForm();
  res.render("posters/create", {
    form: posterForm.toHTML(bootstrapField),
  });
});

//to allow user to post data
router.post("/create", async (req, res) => {
  const posterForm = createPosterForm();
  console.log("hello");
  posterForm.handle(req, {
    success: async (form) => {
      const poster = new Poster(); // this line is to create new instance based on the migration we setup
      poster.set("title", form.data.title);
      poster.set("cost", form.data.cost);
      poster.set("description", form.data.description);
      poster.set("date", form.data.date);
      poster.set("stock", form.data.stock);
      poster.set("height", form.data.height);
      poster.set("width", form.data.width);
      console.log(poster);
      console.log(form.data);
      //must always remember . after getting all the data. must remember to save it
      await poster.save();
      res.redirect("/posters");
    },
    " error": async (form) => {
      //if error den render the form again
      res.render("posters/create", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

module.exports = router; // #3 export out the router
