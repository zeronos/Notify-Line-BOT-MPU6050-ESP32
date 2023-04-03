const express = require("express");
const route = require("./routes/webhookRoute.js");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const webhookFunction = require('./function/webhookFunction.js')


dotenv.config();

const app = express();
app.use('/',route);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port)
    webhookFunction.reciveFallsData();
})