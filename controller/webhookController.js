const webhookFuction = require('../function/webhookFunction.js')
const {infomation,reply} = webhookFuction

const webhook  = function(req,res){
    console.log(req.body);
    //let text = req.body.events[0].message.text.toLowerCase()
    //let sender = req.body.events[0].source.userId
    //let replyToken = req.body.events[0].replyToken
    
    //reply(replyToken)
    /*if (text === 'test1') {
        infomation(sender, text)
        res.sendStatus(200)
    }*/

    res.sendStatus(200)
}

module.exports ={
    webhook
}