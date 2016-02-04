'use strict';

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let menuSchema = new Schema({
  menuName: { type: String, require: true },
  items:[{ type: Schema.Types.ObjectId, ref: 'Item'}]
})


let Menu = mongoose.model('Menu', menuSchema);


module.exports = Menu;
