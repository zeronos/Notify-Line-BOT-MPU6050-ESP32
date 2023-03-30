const dotenv = require('dotenv');
dotenv.config();
const option = {
    port : process.env.MQTT_PORT,
    host: process.env.MQTT_HOST,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    protocol: 'mqtts',
}

module.exports = option