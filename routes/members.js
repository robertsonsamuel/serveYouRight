'use strict';

let express = require('express');
let router = express.Router();
let Employee = require('../models/emp');
let Owner = require('../models/owner');
let jwt = require('jwt-simple')


function createJWT(user) {
  var payload = {
    sub: user._id,
  };
  return jwt.encode(payload, 'secret');
}


/* GET users listing. */

router.post('/login',function (req,res,next) {
  console.log(req.body);
  Owner.findOne({ email: req.body.email }, function(err, user) {
    if(user === null){

      Employee.findOne({ email: req.body.email }, function(err, user) {
        console.log(user);
        if(user === null){

          return res.status(401).send({ message: 'Invalid email and/or password' });

        }else{
          user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
               return res.status(401).send({ message: 'Invalid email and/or password' });
            }else{
              user.password = null;
              return res.send({ token: createJWT(user), user: user });
            }
          });
        }
      })
    }else if(user === null){
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }else{
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
           return res.status(401).send({ message: 'Invalid email and/or password' });
        }else{
          user.password = null;
          return res.send({ token: createJWT(user), user: user });
        }
      });
    }
  })
})

router.post('/register',function (req,res,next) {
  // check if new owner or Employee
  if(req.body.storeCode){
  // is Employee and check if already exists
  Employee.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
     return res.status(409).send({ message: 'Email is already taken' });
    }
  });
  let newEmp = new Employee(req.body);
      newEmp.save(function (err, user) {
        if(err) res.status(500).send({ message: err.message });
        user.password = null;
        res.status(200).send({message:'Success', user})
      })
 }else {
   // it is a new store client
   Owner.findOne({ email: req.body.email }, function(err, existingUser) {
     if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
     }
   });
   let newOwn = new Owner(req.body);
       newOwn.save(function (err, user) {
         if(err) res.status(500).send({ message: err.message });
         user.password = null;
         res.status(200).send({message:'Success', user})
       })
 }
});


module.exports = router;
