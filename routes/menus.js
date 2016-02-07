'use strict';

let express       = require('express'),
    router        = express.Router(),
    Owner         = require('../models/Owner'),
    Menu          = require('../models/Menu'),
    Item          = require('../models/Item'),
    combinedQuery = require('../util/combinedQuery');

router.get('/:ownerId', function (req, res, next) {
  Owner.findOne({_id: req.params.ownerId}).select('-password').populate({ path:'menus employees', select:'-password'})
  .exec(function (err, popOwner) {
    res.status(err ? 400 : 200).send(err || popOwner)
  })
})

router.get('/menu/:menuId', function (req, res, next) {
  Menu.findOne({_id: req.params.menuId}).populate({path:'items'}).exec(function (err, popMenu) {
    if(err) res.status(400).send(err)
    res.status(200).send(popMenu);
  })
})

// create a new owner's menu
router.post('/create/:ownerId', function (req, res, next) {
  combinedQuery.createNewMenu(req, function (err, owner) {
    if(err) return res.status(400).send(err)
    Owner.findOne({_id: owner._id}).select('-password').populate({ path:'menus employees', select:'-password'})
    .exec(function (err, popOwner) {
      res.status(err ? 400 : 200).send(err || popOwner)
    })
  })
})

// delete a owner's menu
router.post('/delete/:ownerId/:menuId', function (req, res, next) {
  combinedQuery.deleteMenu(req, function (err, owner) {
    if(err) return res.status(400).send(err)
    Owner.findOne({_id: owner._id}).select('-password').populate({ path:'menus employees', select:'-password'})
    .exec(function (err, popOwner) {
      res.status(err ? 400 : 200).send(err || popOwner)
    })
  })
})

// create item for menu
router.post('/create/item/:menuId', function (req, res, next) {
  combinedQuery.addItemToMenu(req, function (err, menu) {
    if(err) res.status(400).send(err)
    Menu.findOne({_id: req.params.menuId}).populate({path:'items'}).exec(function (err, popMenu) {
      if(err) res.status(400).send(err)
      res.status(200).send(popMenu);
    })
  })
})

// create item for menu
router.put('/edit/item/:menuId/:itemId', function (req, res, next) {
  Item.editItem(req, function (err, editedItem) {
    if(err) res.status(400).send(err)
    Menu.findOne({_id: req.params.menuId}).populate({path:'items'}).exec(function (err, popMenu) {
      if(err) res.status(400).send(err)
      res.status(200).send(popMenu);
    })
  })
})

// remove item from menu
router.post('/delete/item/:menuId/:itemId', function (req, res, next) {
  combinedQuery.deleteItemFromMenu(req, function (err, menu) {
    if(err) res.status(400).send(err)
    console.log('new menu with removed item', menu);
    Menu.findOne({_id: req.params.menuId}).populate({path:'items'}).exec(function (err, popMenu) {
      if(err) res.status(400).send(err)
      res.status(200).send(popMenu);
    })
  })
})

module.exports = router;
