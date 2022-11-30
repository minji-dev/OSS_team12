"use strict";

const express = require('express');
const router = express.Router();
const request = require('request');
const conf = require('../conf/conf');

const api = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = conf.SERVICE_KEY;

router.get('/', (req, res) => {
    let city = "seoul";
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, (err, res2, body) => {
        if (err) {
            res.render('index', { main: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                console.log(weather.weather[0]);
                res.render('index', {
                    weather: weather.weather[0].main,
                    descript: weather.weather[0].description,
                    loc: weather.name,
                    temp: weather.main.temp,
                    icon: weather.weather.icon,
                    error: null,
                });
            }
        }
    })
});

module.exports = router;