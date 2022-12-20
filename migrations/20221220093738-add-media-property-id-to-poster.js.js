"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};
// A Poster belongs to one Media Property
// so  i must add 1 column in posters table for the media property
exports.up = function (db) {
  return db.addColumn("posters", "media_property_id", {
    type: "int",
    unsigned: true,
    notNull: true,
  });
};

exports.down = function (db) {
  return db.dropTable("posters");
};

exports._meta = {
  version: 1,
};
