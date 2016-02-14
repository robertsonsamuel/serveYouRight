'use strict';

let express       = require('express'),
    router        = express.Router(),
    app           = require('../app'),
    Employee      = require('../models/Employee'),
    Order         = require('../models/Order'),
    combinedQuery = require('../util/combinedQuery'),
    io            = require("socket.io")(4000)
    // io            = require("socket.io")(app)



//socketio
io.set("origins", "*:*");

io.on('orderDone',function (data) {
  console.log(data);
})

io.on('connect',function (data) {
  console.log('connected to client');
})


// gets all orders
router.get('/',function (req, res, next) {
  Order.find({}).populate({path:'items', select:'-itemDescription'}).exec(function (err, foundOrders) {
    res.status(err ? 400 : 200).send(err || foundOrders);
  })
})

router.get('/:storeCode',function (req, res, next) {
  Order.find({storeCode:req.params.storeCode}).populate({path:'items employee', select:'-itemDescription -password'}).exec(function (err, foundOrder) {
    res.status(err ? 400 : 200).send(err || foundOrder);
  })
})

router.post('/newOrder/',function (req, res, next) {
  Order.create(req.body, function (err, order) {
    Order.find({storeCode:req.body.storeCode}).populate({path:'items employee', select:'-itemDescription -password'}).exec(function (err, foundOrder) {
      io.emit('newOrder', {order:foundOrder})
      res.status(err ? 400 : 200).send(err || foundOrder);
    })
  })
})


router.post('/deleteOrder/:orderId',function (req, res, next) {
  Order.findByIdAndRemove(req.params.orderId,function (err) {
    Order.find({storeCode:req.body.storeCode}).populate({path:'items employee', select:'-itemDescription -password'}).exec(function (err, foundOrder) {
      io.emit('newOrder', {order:foundOrder})
      res.status(err ? 400 : 200).send(err || foundOrder);
    })
  })
})

module.exports = router;
