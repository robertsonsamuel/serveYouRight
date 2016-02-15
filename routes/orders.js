'use strict';
module.exports = function(io) {
let express       = require('express'),
    router        = express.Router(),
    app           = require('../app'),
    Employee      = require('../models/Employee'),
    Order         = require('../models/Order'),
    twilio         = require('twilio'),
    client = new twilio.RestClient(process.env.TWILLO_SID, process.env.TWILLO_TOKEN),
    combinedQuery = require('../util/combinedQuery');


function sendSMS(phoneNumber) {
  client.sms.messages.create({
      to:`+${phoneNumber}`,
      from:'+18146193816',
      body:'Order Up!'
  }, function(error, message) {
      if(error) console.log(error);

      if (!error) {

          console.log('Success! The SID for this SMS message is:');
          console.log(message.sid);

          console.log('Message sent on:');
          console.log(message.dateCreated);
      } else {
          console.log('Oops! There was an error.');
      }
  });
}

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
    if(err) return res.status(400).send(err);
    Order.find({storeCode:req.body.storeCode}).populate({path:'items employee', select:'-itemDescription -password'}).exec(function (err, foundOrder) {
      console.log('order by employee', foundOrder);
      io.emit('newOrder', {order:foundOrder})
      sendSMS(req.body.employee.phoneNumber);
      res.status(err ? 400 : 200).send(err || foundOrder);
    })
  })
})

io.on('connect', function(socket) {
  console.log('client connected!');
});

    return router;
}
