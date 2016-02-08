'use strict';

let express       = require('express'),
    router        = express.Router(),
    Employee      = require('../models/Employee'),
    Order         = require('../models/Order'),
    combinedQuery = require('../util/combinedQuery');

// gets all orders
router.get('/',function (req, res, next) {
  Order.find({}).populate({path:'items', select:'-itemDescription'}).exec(function (err, foundOrders) {
    res.status(err ? 400 : 200).send(err || foundOrders);
  })
})

router.get('/:orderId',function (req, res, next) {
  Order.findById(req.params.orderId).populate({path:'items', select:'-itemDescription'}).exec(function (err, foundOrder) {
    res.status(err ? 400 : 200).send(err || foundOrder);
  })
})

router.post('/newOrder/',function (req, res, next) {
  Order.create(req.body, function (err, order) {
    res.status(err ? 400:200).send(err || order);
  })
})


router.post('/deleteOrder/:orderId',function (req, res, next) {
  Order.findByIdAndRemove(req.params.orderId,function (err) {
    res.status(err ? 400:200).send(err || "Deleted!");
  })
})

module.exports = router;
