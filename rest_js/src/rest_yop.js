// rest_yop.js

'use strict';

// A black-magic solution from ESM, waiting for the official support for es6-module by nodejs, planned with node-V12.0
require = require("esm")(module/*, options*/);
const yop_core = require("./yop_core.js");

const express = require('express');
const https = require('https');
const fs = require('fs');

const ssl_options = {
    key: fs.readFileSync("./srv_yop.key"),
    cert: fs.readFileSync("./srv_yop.crt")
};

const yop_rest = express();
const yop_http_port = 8442;
const yop_https_port = 8443;


// ####################################
// Browser security policy: Access-Control-Allow-Origin
// ####################################

yop_rest.use('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


// ####################################
// end points
// ####################################

yop_rest.get('/calc_age', (req, res) => {
    console.log('yop_rest: calc_age: req.query.width: '+ req.query.birth_year);
    let q_birth_year = parseInt(req.query.birth_year);
    console.log("q_birth_year: " + q_birth_year)
    let r_age = yop_core.calcAge(q_birth_year);
    res.send(r_age.toString());
});

yop_rest.get('/calc_birth_year', (req, res) => {
    console.log('yop_rest: calc_year_birth: req.query.age: '+ req.query.age);
    let q_age = parseInt(req.query.age);
    let r_birth_year = yop_core.calcBirthYear(q_age);
    res.send(r_birth_year.toString());
});

// the sugar
yop_rest.get('/call_activities', (req, res) => {
    console.log('yop_rest: call_activities');
    res.json(yop_core.callActivities());
});

// ####################################
// main whole loop
// ####################################
//yop_rest.listen(yop_http_port, () => {
//    console.log('yop_rest: listening at http port '+ yop_http_port);
//});

https.createServer(ssl_options, yop_rest).listen(yop_https_port, () => {
    console.log('yop_rest_app: listening at https port '+ yop_https_port);
});



