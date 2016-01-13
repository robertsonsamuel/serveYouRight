'use strict';

let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let Schema = mongoose.Schema;

let ownerSchema = new Schema({
  firstName: { type: String, require: true , unique: true },
  lastName: { type: String, require: true },
  userName: { type: String, require: true },
  password: { type: String, require: true },
  companyName: { type: String, require: false },
  storeCode: { type: String, unique: true },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  menus: [{ type: Schema.Types.ObjectId, ref: 'Menu' }],
})

userSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) {
    return next();
  }
  user.storeCode = Math.floor(Math.random()*16777215).toString(16);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

let User = mongoose.model('Owner', ownerSchema);

export default Owner;
