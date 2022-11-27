"use strict";

const express = require("express");
const app = express();

// static 폴더 설정
app.use(express.static(`${__dirname}/public`));

// 화면 engine을 ejs로 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// view 경로 설정
app.set('views', __dirname + '/views');

// 라우팅
const home = require("./routes");
app.use("/", home);

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`server works on : http://localhost:${PORT}`);
})