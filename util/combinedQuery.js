'use strict';
let Owner    = require('../models/Owner'),
    Employee = require('../models/Employee'),
    Menu     = require('../models/Menu'),
    jwt      = require('jwt-simple');

function createJWT(user) {
  var payload = {
    sub: user._id,
  };
  return jwt.encode(payload, 'secret');
}

module.exports = {
  ownerOrEmployee: function(req, cb){
    Owner.findOne({ email: req.body.email }, function(err, user) {
      if(err) return cb(err, null);
      if(user === null){

        Employee.findOne({ email: req.body.email }, function(err, user) {
          if(err) return cb(err, null);
          if(user === null){

            return cb({ message: 'Invalid email and/or password' }, null);

          }else{
            user.comparePassword(req.body.password, function(err, isMatch) {
              if (!isMatch) {
                 return cb({ message: 'Invalid email and/or password' }, null);
              }else{
                user.password = null;
                // here we send back an employee
                return cb(null, { token: createJWT(user), user: user });
              }
            });
          }
        })
      }else if(user === null){
        return cb({ message: 'Invalid email and/or password' }, null);
      }else{
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (!isMatch) {
             return cb({ message: 'Invalid email and/or password' }, null);
          }else{
            // here we send back the owner
            user.password = null;
            return cb(null, { token: createJWT(user), user: user });
          }
        });
      }
    })
  },

  makeOwnerOrEmployee: function(req, cb){
    // check if new owner or Employee
    if(req.body.storeCode){
    // is Employee and check if already exists
    Employee.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
       return cb(null, { message: 'Email is already taken' });
      }
    });
    let newEmp = new Employee(req.body);
        newEmp.save(function (err, user) {
          if(err) return cb(null, { message: err.message });
          user.password = null;
          return cb(user, {message:'Success', })
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
 },
  makeEmployee: function(req, cb){
    Employee.findOne({email: req.body.email}, function(err, employee){
      if(err) return cb(err, null)
      if(!employee){
        Employee.create(req.body, function(err, createdEmployee){
          if(err) return cb(err, null);
          Owner.findOne({storeCode:req.body.storeCode}, function(err, owner){
            if(err) return cb(err, null);
            owner.employees.push(createdEmployee._id);
            owner.save(function(err, savedOwner){
              if(err) return cb(err, null);
               cb(null, createdEmployee); //done
            })
          })
        })
      }else{
        cb({message:'Email is already taken.'}, null);
      }
    })

  },
  createNewMenu: function (req, cb) {
    Owner.findOne({_id: req.params.ownerId }).select('-password').exec(function (err, owner) {
      if (err) return cb(err, null);
      Menu.create(req.body, function (err, createdMenu) {
        if(err) return cb(err, null);
        console.log('createdMenu', createdMenu);
        owner.menus.push(createdMenu._id)
        owner.save(function (err, savedOwner) {
          if (err) return cb(err, null);
          cb(null, savedOwner);  //done
        })
      })
    })
  },
  deleteMenu: function (req, cb) {
    Owner.findOne({_id: req.params.ownerId}).select('-password').lean().exec(function (err, owner) {

      if (menuSet.has(req.params.menuId)){

        menuSet.delete(req.params.menuId)
          owner.menus = Array.from(menuSet)
            Menu.findByIdAndRemove(req.params.menuId,function (err, removedMenu) {
              if(err) return cb(err, null);
            })
            owner.save(function (err, savedOwner) {
              if(err) return cb(err, null);
              console.log('saved owner', savedOwner);
              return cb(null, savedOwner);
        })
      }else {
        cb('Menu does not exist with this owner', null);
      }
    })
  },
  populateOwner: function(owner, cb){
    console.log(owner);
  }


}
