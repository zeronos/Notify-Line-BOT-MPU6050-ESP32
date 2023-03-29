const dotenv = require('dotenv');
const request = require('request')
dotenv.config();

function infomation (){
    let data = {
        to: sender,
        messages: [
          {
            type: 'text',
            text: 'uid: '+sender
          }
        ]
      }
      request({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+process.env.CH_ACCESS_TOKEN
        },
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        body: data,
        json: true
      }, function (err, res, body) {
        if (err) console.log('error')
        if (res) console.log('success')
        if (body) console.log(body)
      })
}

function reply(reply_token) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+process.env.CH_ACCESS_TOKEN
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: 'Hello'
        }]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}

module.exports = {
    infomation,
    reply
}