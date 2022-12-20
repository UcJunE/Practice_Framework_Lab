const bookshelf = require("../bookshelf");

const Poster = bookshelf.model("Poster", {
  tableName: "posters",
  category() {
    return this.belongsTo("Category");
  },
  tags() {
    return this.belongsToMany("Tag");
  },
});

const Tag = bookshelf.model("Tag", {
  tableName: "tags",
  product() {
    return this.belongsToMany("Product");
  },
});

const Category = bookshelf.model("Category", {
  tableName: "categories",
  posters() {
    return this.hasMany("Poster");
  },
});
module.exports = { Poster, Category, Tag };
