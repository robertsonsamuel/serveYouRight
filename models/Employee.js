'use strict';

let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let Schema = mongoose.Schema;

let empSchema = new Schema({
  firstName: { type: String, require: true , unique: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  storeCode: { type: String, unique: false },
  owner:{ type: Boolean, default:false },
  menus: [{ type: Schema.Types.ObjectId, ref: 'Menu' }],
  orders:[{ type: Schema.Types.ObjectId, ref: 'Item'}]
})

empSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

empSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

let Employee = mongoose.model('Employee', empSchema);


module.exports = Employee;
