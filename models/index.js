const bookshelf = require("../bookshelf");

const Poster = bookshelf.model("Poster", {
  tableName: "posters",
  category() {
    return this.belongTo("Category");
  },
});

const Category = bookshelf.model("Category", {
  tableName: "categories",
  posters() {
    return this.hasMany("Poster");
  },
});
module.exports = { Poster, Category };
