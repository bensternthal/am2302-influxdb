require('dotenv').config();

const DHT = require('node-dht-sensor');
let DHTJSON = {};


exports.getJSON = function() {
    return new Promise(function(resolve, reject) {

        DHT.read(22, 4, function(err, temperature, humidity) {
            if (!err) {
                DHTJSON['current_temperature'] = temperature;
                DHTJSON['current_humidity'] = humidity;

                resolve(DHTJSON);
            } else {
                return reject('Sensor Error' + err);
            }

        });
    });
};

