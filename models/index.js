const bookshelf = require("../bookshelf");

const Poster = bookshelf.model("Poster", {
  tableName: "posters",
  category() {
    return this.belongTo("Category");
  },
  tags() {
    return this.belongToMany("Tag");
  },
});

const Tag = bookshelf.model("Tag", {
  tableName: "tags",
  product() {
    return this.belongToMany("Product");
  },
});

const Category = bookshelf.model("Category", {
  tableName: "categories",
  posters() {
    return this.hasMany("Poster");
  },
});
module.exports = { Poster, Category, Tag };
