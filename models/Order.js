'use strict';

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let orderSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee'},
  storeCode:{type:String},
  items:[{ type: Schema.Types.ObjectId, ref: 'Item'}]
})

let Order = mongoose.model('Order', orderSchema);


module.exports = Order;
