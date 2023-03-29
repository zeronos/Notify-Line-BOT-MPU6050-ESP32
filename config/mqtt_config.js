const dotenv = require('dotenv');
dotenv.config();
const option = {
    port : process.env.MQTT_PORT,
    host: process.env.MQTT_HOST,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
}

module.exports = option