const webhookFunction = require('../function/webhookFunction.js')
const {infomation,eventHandler} = webhookFunction
const IP = require('ip');

const webhook  = function(req,res){
    let text = req.body.events[0].message.text.toLowerCase()
    let sender = req.body.events[0].source.userId
    let reply_token = req.body.events[0].replyToken
    
    if (text === 'รายงาน') {
        infomation(sender,reply_token)
    }
    else{
        eventHandler(text,sender,reply_token);
    }
    res.sendStatus(200)
}

module.exports ={
    webhook
}