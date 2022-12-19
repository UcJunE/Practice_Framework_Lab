const express = require("express");
const router = express.Router(); // #1 - Create a new express Router
const { Poster, Category } = require("../models");
//  #2 Add a new route to the Express router
const { bootstrapField, createPosterForm } = require("../forms");
const async = require("hbs/lib/async");

// to get all the posters collection
router.get("/", async (req, res) => {
  let posters = await Poster.collection().fetch({
    withRelated: ["category"],
  });

  res.render("posters/index", {
    posters: posters.toJSON(),
  });
});

//to display the form
router.get("/create", async (req, res) => {
  console.log("get route create form");
  // inporting form setup
  const posterForm = createPosterForm();
  res.render("posters/create", {
    form: posterForm.toHTML(bootstrapField),
  });
});

//to allow user to post data
router.post("/create", async (req, res) => {
  const allCategories = await Category.fetchAll().map((category) => {
    return [category.get("id"), category.get("name")];
  });

  const posterForm = createPosterForm();
  console.log("hello from create post");
  posterForm.handle(req, {
    success: async (form) => {
      const poster = new Poster(form.data); // this line is to create new instance based on the migration we setup
      // poster.set("title", form.data.title);
      // poster.set("cost", form.data.cost);
      // poster.set("description", form.data.description);
      // poster.set("date", form.data.date);
      // poster.set("stock", form.data.stock);
      // poster.set("height", form.data.height);
      // poster.set("width", form.data.width);
      // console.log(poster);
      // console.log(form.data);
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

// to parse in the existing data from the table before proceeed to updating
router.get("/update/:poster_id", async (req, res) => {
  //retrive the poster
  const posterId = req.params.poster_id;
  // console.log("this is poster id :" + posterId);
  //how to retrive id?
  const poster = await Poster.where({
    id: posterId,
  }).fetch({
    require: true,
  });

  //fetch all the categories
  const allCategories = await Category.fetchAll().map((category) => {
    return [category.get("id"), category.get("name")];
  });

  //Poster is a table name which is posters
  const posterForm = createPosterForm(allCategories);
  //fill in the existing values from table
  // console.log(posterForm);
  posterForm.fields.title.value = poster.get("title");
  posterForm.fields.cost.value = poster.get("cost");
  posterForm.fields.description.value = poster.get("description");
  posterForm.fields.date.value = poster.get("date");
  posterForm.fields.stock.value = poster.get("stock");
  posterForm.fields.height.value = poster.get("height");
  posterForm.fields.width.value = poster.get("width");
  posterForm.fields.category_id.value = poster.get("category_id");

  //why the form dint even appear on update route?????????
  res.render("posters/update", {
    form: posterForm.toHTML(bootstrapField),
    poster: poster.toJSON(),
  });
});

//to update the form
router.post("/update/:poster_id", async (req, res) => {
  const allCategories = await Category.fetchAll().map((category) => {
    return [category.get("id"), category.get("name")];
  });

  // 1st fetch the product that we wanna update
  //get it from the main table
  const poster = await Poster.where({
    id: req.params.poster_id,
  }).fetch({
    require: true,
  });

  // process the form
  const posterForm = createPosterForm(allCategories);
  posterForm.handle(req, {
    success: async (form) => {
      poster.set(form.data);
      poster.save();
      res.redirect("/posters");
    },
    error: async (form) => {
      res.render("posters/update", {
        form: form.toHTML(bootstrapField),
        poster: poster.toJSON(),
      });
    },
  });
});

router.get("/delete/:poster_id", async (req, res) => {
  //fetcth the product that we wanted to del
  const poster = await Poster.where({
    id: req.params.poster_id,
  }).fetch({
    require: true,
  });
  res.render("posters/delete", {
    poster: poster.toJSON,
  });
});

router.post("/delete/:poster_id", async (req, res) => {
  //fetch id 1st
  const poster = await Poster.where({
    id: req.params.poster_id,
  }).fetch({
    require: true,
  });
  await poster.destroy();
  res.redirect("/posters");
});

module.exports = router; // #3 export out the router
