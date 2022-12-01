"use strict";

const express = require('express');
const router = express.Router();
const request = require('request');
const conf = require('../conf/conf');

let lat;
let lon;
let weather_info;
let air_info;
let clothe_info = [];

const api = "https://api.openweathermap.org/data/2.5/";
const apiKey = conf.SERVICE_KEY;

router.get('/', (req, res) => {
    res.render('index', {
        weather: null,
        loc: 'Locating...',
        temp: null,
        icon: null,
        air: null,
        error: null,
    });
});

router.get('/weather', (req, res, next) => {
    lat = req.query.lat;
    lon = req.query.lon;
    let url = api+`weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    request(url, async (err, res2, body) => {
        if (err) {
            res.render('index', { weather: null, temp: null, loc: 'Error, please try again' });
        } else {
            weather_info = await JSON.parse(body);
            if (weather_info.main == undefined) {
                res.render('index', { weather: null, temp: null, loc: 'Error, please try again' });
            } else {
                //기온에 따른 옷차림
                if(weather_info.main.temp<4){
                    clothe_info.push('패딩');
                    clothe_info.push('코트');
                    clothe_info.push('목도리');
                }
                else if(weather_info.main.temp<8){
                    clothe_info.push('코트');
                    clothe_info.push('가죽자켓');
                    clothe_info.push('니트');
                }
                else if(weather_info.main.temp<11){
                    clothe_info.push('트렌치코트');
                    clothe_info.push('야상');
                    clothe_info.push('니트');
                }
                else if(weather_info.main.temp<16){
                    clothe_info.push('가디건');
                    clothe_info.push('야상');
                    clothe_info.push('면바지');
                }
                else if(weather_info.main.temp<19){
                    clothe_info.push('얇은 니트');
                    clothe_info.push('맨투맨');
                    clothe_info.push('청바지');
                }
                else if(weather_info.main.temp<22){
                    clothe_info.push('얇은 가디건');
                    clothe_info.push('긴팔');
                    clothe_info.push('면바지');
                }
                else if(weather_info.main.temp<27){
                    clothe_info.push('반팔');
                    clothe_info.push('얇은 셔츠');
                    clothe_info.push('반바지');
                }
                else{
                    clothe_info.push('민소매');
                    clothe_info.push('반팔');
                    clothe_info.push('반바지');
                }
            }
        }
        next();
    })
}, (req, res, next) => {
    let url = api+`air_pollution?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    request(url, async (err, res3, body) => {
        if (err) {
            res.render('index', { weather: null, temp: null, loc: 'Error, please try again' });
        } else {
            air_info = await JSON.parse(body);
            if (air_info.list == undefined) {
                res.render('index', { weather: null, temp: null, loc: 'Error, please try again' });
            }
        }
    })
});

router.get('/main', (req, res) => {
    res.render('snd', {
        weather: weather_info.weather[0].main,
        loc: weather_info.name,
        temp: weather_info.main.temp,
        icon: weather_info.weather.icon,
        air: air_info.list[0].main.aqi,
        clothe_info: clothe_info,
        error: null,
    });
});

module.exports = router;