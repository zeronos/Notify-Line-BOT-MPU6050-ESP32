const webhookFuction = require('../function/webhookFunction.js')
const {infomation,eventHandler,requestLineAPI} = webhookFuction
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

const reciveFallsData = function(req,res){
    let data = {
        messages: [
          {
            type: 'text',
            text: '!!ตรวจพบการหกล้ม!! โปรดโทรแจ้งรถเจ้าหน้าที่พยาบาล หรือตรวจสอบและปฐมพยาลให้แก่ผู้บาดเจ็บ'
          }
        ]
    }
    requestLineAPI(data);
    const ipAddresses = req.header('x-forwarded-for');
    res.send(ipAddresses);

}

module.exports ={
    webhook,
    reciveFallsData
}