'use strict';

let express       = require('express'),
    router        = express.Router(),
    Employee      = require('../models/Employee'),
    Owner         = require('../models/Owner'),
    Order         = require('../models/Order'),
    combinedQuery = require('../util/combinedQuery');

/* GET users listing. */

router.get('/ownerInfo/:ownerId',function (req,res,next) {
  Owner.findOne({_id: req.params.ownerId}).select('-password')
  .populate({path: 'employees menus', select:'-password'})
  .exec(function (err, owner) {
    res.status(err ? 400 : 200).send(err || owner);
  });
});

router.get('/employeeInfo/:employeeId',function (req,res,next) {
  Employee.findOne({_id: req.params.employeeId}).select('-password')
  .populate({path: 'orders menus', select:'-password'})
  .exec(function (err, owner) {
    res.status(err ? 400 : 200).send(err || owner);
  });
});

router.post('/login',function (req,res,next) {
  combinedQuery.ownerOrEmployee(req, function(err, user){
    console.log('user', user);
    if(err) return res.status(400).send({message: err})
    if (user.user.owner){
      Owner.findOne({id: user._id }).select('-password')
      .populate({ path:'employees menus', match: user.storeCode, select:'-password' })
      .exec(function (err, popUser) {
      res.status(err ? 400 : 200).send(err || {token:user.token, user:popUser});
      })
    }else {
      Employee.findOne({id: user._id}).select('-password')
      .populate({path:'orders menus'})
      .exec(function (err, employee) {
        res.status(err ? 400 : 200).send(err || {token:user.token, user:employee});
      })
    }
  });
})

router.post('/register',function (req,res,next) {
  if (req.body.storeCode){ // register employee
    combinedQuery.makeEmployee(req, function(err, employee){

    });
  } else { //register owner
    Owner.create(req.body, function (err, createdOwner) {
      res.status(err ? 400 : 200).send(err || createdOwner);
    })
   }
});



module.exports = router;
