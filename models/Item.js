'use strict';

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let itemSchema = new Schema({
  itemName:{ type: String, require: true  },
  itemPrice:{ type: Number, require: true },
  itemDescription:{type: String, require: true },
})



itemSchema.statics.editItem = function (req, cb) {
  Item.findOneAndUpdate({_id: req.params.itemId}, req.body, function (err, editedItem) {
    if (err) return cb(err, null);
    return cb(null, editedItem)
  })
}

let Item = mongoose.model('Item', itemSchema);

module.exports = Item;
