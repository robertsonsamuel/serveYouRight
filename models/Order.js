'use strict';

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let orderSchema = new Schema({
  order:[{ type: Schema.Types.ObjectId, ref: 'Item'}]
})

let Order = mongoose.model('Order', orderSchema);


module.exports = Order;
