"use strict";

const express = require('express');
const router = express.Router();
const request = require('request');
const conf = require('../conf/conf');

let weather;

const api = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = conf.SERVICE_KEY;

router.get('/', (req, res) => {
    res.render('index', {
        weather: null,
        descript: null,
        loc: 'Locating...',
        temp: null,
        icon: null,
        error: null,
    });
});

router.get('/weather', (req, res) => {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let url = api+`?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    request(url, async (err, res2, body) => {
        if (err) {
            res.render('index', { weather: null, temp: null, loc: 'Error, please try again' });
        } else {
            weather = await JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index', { weather: null, temp: null, loc: 'Error, please try again' });
            } else {
                console.log(weather);
                return res.redirect('http://localhost:3000/main');
            }
        }
    })
});

router.get('/main', (req, res) => {
    res.render('snd', {
        weather: weather.weather[0].main,
        descript: weather.weather[0].description,
        loc: weather.name,
        temp: weather.main.temp,
        icon: weather.weather.icon,
        error: null,
    });
});

module.exports = router;