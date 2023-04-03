const dotenv = require('dotenv');
const request = require('request')
const mqtt = require('mqtt')
const mqtt_options = require('../config/mqtt_config')
dotenv.config();

function eventHandler (text,sender,reply_token){
    if(text === 'กินยาด้วยนะ' || text === 'กินข้าวด้วยนะ' || text === 'เข้านอนได้แล้ว'){
      publishMQTT(convertText2Publish(text))
      sendText(text,sender,reply_token)
    }
    else{
      sendText('No-reply',sender,reply_token)
    }
}

const reciveFallsData = function(req,res){

  let client = mqtt.connect(mqtt_options);
  client.on('connect', function() { // When connected
     client.subscribe(process.env.MQTT_SUBSCRIBE_TOPIC,function(){
      client.on('message', function(topic, message) {
        let data = {
          messages: [
            {
              type: 'text',
              text: '!!ตรวจพบการหกล้ม!! โปรดโทรแจ้งรถเจ้าหน้าที่พยาบาล หรือตรวจสอบและปฐมพยาลให้แก่ผู้บาดเจ็บ'
            }
          ]
        }
        requestLineAPI(data);
      });
    });
  });
}

function infomation (sender,reply_token){
    let data = {
        to: sender,
        replyToken: reply_token,
        messages: [
          {
            type: 'text',
            text: 'uid: '+sender
          }
        ]
      }
      requestLineAPI(data)
}

function sendText(text,sender,reply_token){
    let data
    if(text === 'No-reply'){
        data = {
          to: sender,
          replyToken: reply_token,
          messages: [
            {
              type: 'text',
              text: 'ขอบคุณที่ส่งข้อความ ระบบอยู่ในช่วงการพัฒนาจึงไม่ได้สามารถตอบกลับข้อความได้ ขออภัยในความไม่สะดวก'
            }
          ]
        }
    }
    else{
        data = {
          to: sender,
          replyToken: reply_token,
          messages: [
            {
              type: 'text',
              text: 'ส่งสัญญาณ: '+text
            }
          ]
        }
    }
    requestLineAPI(data)
}

function publishMQTT(text){
  let client = mqtt.connect(mqtt_options);
  client.on('connect', function() { // When connected
      // publish a message to a topic
      client.publish(process.env.MQTT_TOPIC, text, function() {
          console.log("Message is published");
          client.end(); // Close the connection when published
      });
  });
}

function requestLineAPI(data){

  if(!data.hasOwnProperty('to')){
    data.to = process.env.LINE_USERID
    request({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+process.env.CH_ACCESS_TOKEN
      },
      url: 'https://api.line.me/v2/bot/message/push',
      method: 'POST',
      body: data,
      json: true
    })
  }
  else{
    request({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+process.env.CH_ACCESS_TOKEN
      },
      url: 'https://api.line.me/v2/bot/message/reply',
      method: 'POST',
      body: data,
      json: true
    })
  }

  
}

function convertText2Publish(text){
  let transText;
  if(text === 'กินยาด้วยนะ')
    transText = 'med'
  else if(text === 'กินข้าวด้วยนะ')
    transText = "eat"
  else if(text === 'เข้านอนได้แล้ว')
    transText = 'sleep'

  return transText
}


module.exports = {
    infomation,
    eventHandler,
    reciveFallsData
}