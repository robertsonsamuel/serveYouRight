'use strict';

let express       = require('express'),
    router        = express.Router(),
    Owner         = require('../models/Owner'),
    Menu          = require('../models/Menu'),
    combinedQuery = require('../util/combinedQuery');

router.get('/:ownerId', function (req, res, next) {
  Owner.findOne({_id: req.params.ownerId}).select('-password').populate({ path:'menus employees', select:'-password'})
  .exec(function (err, popOwner) {
    res.status(err ? 400 : 200).send(err || popOwner)
  })
})

router.post('/create/:ownerId', function (req, res, next) {
  combinedQuery.createNewMenu(req, function (err, owner) {
    if(err) return res.status(400).send(err)
    Owner.findOne({_id: owner._id}).select('-password').populate({ path:'menus employees', select:'-password'})
    .exec(function (err, popOwner) {
      res.status(err ? 400 : 200).send(err || popOwner)
    })
  })
})

router.post('/delete/:ownerId/:menuId', function (req, res, next) {
  combinedQuery.deleteMenu(req, function (err, owner) {
    if(err) return res.status(400).send(err)
    console.log('owner from delete', owner);
    Owner.findOne({_id: owner._id}).select('-password').populate({ path:'menus employees', select:'-password'})
    .exec(function (err, popOwner) {
      res.status(err ? 400 : 200).send(err || popOwner)
    })
  })
})

module.exports = router;
