'use strict';

let express       = require('express'),
    router        = express.Router(),
    Employee      = require('../models/Employee'),
    Owner         = require('../models/Owner'),
    Order         = require('../models/Order'),
    combinedQuery = require('../util/combinedQuery'),
    auth          = require('../util/auth');

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
    if(err) return res.status(400).send({message: err})
    if (user.user.owner){
      Owner.findById(user.user._id).select('-password')
      .populate({ path:'employees menus', select:'-password' })
      .exec(function (err, popUser) {
        if(err) console.log(err);
      res.status(err ? 400 : 200).send(err || {token:user.token, user:popUser});
      })
    }else {
      Employee.findById(user.user._id).select('-password')
      .populate({path:'orders menus'})
      .exec(function (err, employee) {
        res.status(err ? 400 : 200).send(err || {token:user.token, user:employee});
      })
    }
  });
})

router.post('/register', function(req, res, next) {
  if (req.body.storeCode) { // register employee
    auth.checkEmployeeRegistration(req, function (err) {
      if(!err){
        combinedQuery.makeEmployee(req, function(err, employee) {
          res.status(err ? 400 : 200).send(err || employee);
        });
      }else {
        return res.status(400).send(err);
      }
    })

  } else { //register owner
    auth.checkOwnerRegistration(req, function(err) {
      if (!err) {
        Owner.create(req.body, function(err, createdOwner) {
          res.status(err ? 400 : 200).send(err || createdOwner);
        })
      }else{
        return res.status(400).send(err);
      }
    })
  }
});

router.put('/edit/employee/:employeeId/:ownerId', function (req, res, next) {
  auth.hashPassword(req, function (err, hashedEmployee) {
      if(err) return res.status(400).send(err);
    Employee.findByIdAndUpdate(req.params.employeeId, hashedEmployee, function (err, employee) {
      if(err) return res.status(400).send(err);
      Owner.findOne({_id: req.params.ownerId}).select('-password').populate({ path:'menus employees', select:'-password'})
      .exec(function (err, popOwner) {
        res.status(err ? 400 : 200).send(err || popOwner)
      })
    })
  })
})

router.post('/delete/employee/:employeeId/:ownerId', function (req, res, next) {
  Employee.findByIdAndRemove(req.params.employeeId, function (err, employee) {
    if(err) return res.status(400).send(err);
    Owner.findOne({_id: req.params.ownerId}).select('-password').populate({ path:'menus employees', select:'-password'})
    .exec(function (err, popOwner) {
      res.status(err ? 400 : 200).send(err || popOwner)
    })
  })
})

module.exports = router;
