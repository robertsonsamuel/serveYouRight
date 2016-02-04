'use strict';

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let itemSchema = new Schema({
  itemName:{ type: String, require: true  },
  itemPrice:{ type: Number, require: true },
  itemDescription:{type: String, require: true },
})


let Item = mongoose.model('Item', itemSchema);


module.exports = Item;
