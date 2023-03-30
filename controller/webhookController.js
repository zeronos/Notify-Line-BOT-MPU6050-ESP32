const webhookFuction = require('../function/webhookFunction.js')
const {infomation,eventHandler} = webhookFuction

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
}

module.exports ={
    webhook
}