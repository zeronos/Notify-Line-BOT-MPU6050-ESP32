const express = require("express");
const route = require("./routes/webhookRoute.js");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use('/',route);

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})