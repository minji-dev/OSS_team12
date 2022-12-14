"use strict";

const express = require('express');
const request = require('request');
const router = express.Router();
const conf = require('../conf/conf');
const https = require("https");
const parser = require("node-html-parser");

let lat;
let lon;
let weather_info;
let air_info;
let clothe_info;

const api = "https://api.openweathermap.org/data/2.5/";
const apiKey = conf.SERVICE_KEY;

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/musinsa', async (req,res) => {
    let type=req.query.type;
    const header={
        headers:{
            "User-Agent":"..."
        }
    }
    let url= await "https://www.musinsa.com/search/musinsa/integration?type=&q="+type;
    let send_things={};
    
    https.get(url, header, async (red) => {
        let data="";
        
        await red.on("data",(d)=>{
            data+=d;
        })
        await red.on("end",()=>{
            let root=parser.parse(data);
            const all_brand=root.querySelectorAll(".item_title");
            send_things['brand1']=all_brand[0].innerText.trim();
            send_things['brand2']=all_brand[1].innerText.trim();
            console.log(send_things);
            const all_name=root.querySelectorAll(".list_info a[title]");
            send_things['name1']=all_name[0].innerText.trim();
            send_things['name2']=all_name[1].innerText.trim();
            //send_things['name']=root.querySelector(".list_info a[title]").innerText.trim();
            console.log(send_things);
            const all_price=root.querySelectorAll(".price");
            send_things['price1']=all_price[0].innerText.trim();
            send_things['price2']=all_price[1].innerText.trim();
            //send_things['price']=root.querySelector(".price").innerText.trim();
            console.log(send_things);
            const all_photo=root.querySelectorAll("div.list_img > a > img.lazyload.lazy");
            send_things['photo1']="https:"+all_photo[0].attributes['data-original'];
            send_things['photo2']="https:"+all_photo[1].attributes['data-original'];
            //send_things['photo']="https:"+root.querySelector("div.list_img > a > img.lazyload.lazy").attributes['data-original'];
            console.log(send_things);
            const json=JSON.stringify(send_things);
            res.send(json);
        })
    })
})

router.get('/location', async (req, res, next) => {
    lat = req.query.lat;
    lon = req.query.lon;
    let url = await api+`weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    clothe_info = [];
    request(url, async (err, res2, body) => {
        if (err) {
            res.sendStatus(404);
        } else {
            weather_info = await JSON.parse(body);
            console.log(weather_info);
            if (weather_info.main === undefined) {
                res.sendStatus(404);
            } else {
                //????????? ?????? ?????????
                if(weather_info.main.temp<4){
                    clothe_info.push('??????');
                    clothe_info.push('??????');
                    clothe_info.push('?????????');
                }
                else if(weather_info.main.temp<8){
                    clothe_info.push('??????');
                    clothe_info.push('????????????');
                    clothe_info.push('??????');
                }
                else if(weather_info.main.temp<11){
                    clothe_info.push('???????????????');
                    clothe_info.push('??????');
                    clothe_info.push('??????');
                }
                else if(weather_info.main.temp<16){
                    clothe_info.push('?????????');
                    clothe_info.push('??????');
                    clothe_info.push('?????????');
                }
                else if(weather_info.main.temp<19){
                    clothe_info.push('?????? ??????');
                    clothe_info.push('?????????');
                    clothe_info.push('?????????');
                }
                else if(weather_info.main.temp<22){
                    clothe_info.push('?????? ?????????');
                    clothe_info.push('??????');
                    clothe_info.push('?????????');
                }
                else if(weather_info.main.temp<27){
                    clothe_info.push('??????');
                    clothe_info.push('?????? ??????');
                    clothe_info.push('?????????');
                }
                else{
                    clothe_info.push('?????????');
                    clothe_info.push('??????');
                    clothe_info.push('?????????');
                }
            }
        }
        next();
    })
}, async (req, res, next) => {
    let url = await api+`air_pollution?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    request(url, async (err, res3, body) => {
        if (err) {
            res.sendStatus(404);
        } else {
            air_info = await JSON.parse(body);
            if (air_info.list === undefined) {
                res.sendStatus(404);
            } else {
                let dust = air_info.list[0].main.aqi;
                if(dust === 1) {
                    air_info = "?????? ??????";
                } else if(dust === 2) {
                    air_info = "??????";
                } else if(dust === 3) {
                    air_info = "??????";
                } else if(dust === 4) {
                    air_info = "??????";
                } else if(dust === 5) {
                    air_info = "?????? ??????";
                }
                res.sendStatus(200);
            }
        }    
    })
});

router.get('/main', (req, res) => {
    console.log(weather_info);
    res.render('snd', {
        weather: weather_info.weather[0].main,
        descript: weather_info.weather[0].description,
        loc: weather_info.name,
        temp: weather_info.main.temp,
        feels: weather_info.main.feels_like,
        dust: air_info,
        clothe_info: clothe_info,
        error: null
    });
});

module.exports = router;