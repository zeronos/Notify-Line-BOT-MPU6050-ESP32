let express = require('express');
let router = express.Router();

let webhookController = require('../controller/webhookController.js')

router.get('/webhook', webhookController.home)

module.exports = router;