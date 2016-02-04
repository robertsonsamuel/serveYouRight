'use strict';

let express       = require('express'),
    router        = express.Router(),
    Employee      = require('../models/Employee'),
    Order         = require('../models/Order'),
    combinedQuery = require('../util/combinedQuery');

router.get('/:orderId',function (req, res, next) {
  res.status(err ? 400:200).send(err || order)
})
