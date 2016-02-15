'use strict';
let Owner    = require('../models/Owner'),
    bcrypt   = require("bcrypt"),
    Employee = require('../models/Employee');

module.exports =  {
  checkEmployeeRegistration: function (req, cb) {
    Employee.findOne({email:req.body.email}, function (err, employee) {
      if(err) return cb('Error validating email address')
      employee ?  cb('Email is already taken.') :  cb(null)  // returns null if no employee
    })
  },
  checkOwnerRegistration: function (req, cb) {
    Owner.findOne({email:req.body.email}, function (err, owner) {
      if(err) console.log(err);
      console.log(owner);
      if(err) return cb('Error validating email address.')
      owner ?  cb('Email is already taken.') :  cb(null)  // returns null if no owner
    })
  },
  hashPassword: function (req, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      if(err) return cb(err, null);
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        if(err) return cb(err, null);
        req.body.password = hash;
        return cb(null, req.body)
      });
    });
  }
};
