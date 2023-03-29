const dotenv = require('dotenv');
dotenv.config();

const config = {
    channelAccessToken: process.env.CH_ACCESS_TOKEN,
    channelSecret: process.env.CH_SECRET
};

module.exports = config