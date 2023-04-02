let express = require('express');
let router = express.Router();
const line = require('@line/bot-sdk');
const config = require('../config/line_config.js')

let webhookController = require('../controller/webhookController.js')

router.post('/webhook',line.middleware(config), webhookController.webhook),
router.get('/reciveFallsData',webhookController.reciveFallsData)


module.exports = router;