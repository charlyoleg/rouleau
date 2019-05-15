// rest_yop.js

"use strict";

// A black-magic solution from ESM, waiting for the official support for es6-module by nodejs, planned with node-V12.0
// require = require("esm")(module/*, options*/);
// const yop_core = require("./yop_core.js");
import * as yop_core from "./yop_core.js";

// const express = require('express');
// const https = require('https');
// const fs = require('fs');
import express from "express";
import fs from "fs";
import https from "https";

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

yop_rest.use("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// ####################################
// end points
// ####################################

/**
 * @swagger
 * /calc_age:
 *   get:
 *     description: Returns the age of the user
 *     parameters:
 *       - name: birth_year
 *         in: query
 *         required: true
 *         description: the year of birth of the user
 *         schema:
 *           type:string
 *     responses:
 *       200:
 *         description: the age
 */
yop_rest.get("/calc_age", (req, res) => {
    console.log("yop_rest: calc_age: req.query.width: " + req.query.birth_year);
    const q_birth_year = parseInt(req.query.birth_year);
    console.log("q_birth_year: " + q_birth_year);
    const r_age = yop_core.calcAge(q_birth_year);
    res.send(r_age.toString());
});

/**
 * @swagger
 * /calc_birth_year:
 *   get:
 *     description: Returns the year of birth of the user
 *     parameters:
 *       - name: age
 *         in: query
 *         required: true
 *         description: the age of the user
 *         schema:
 *           type:string
 *     responses:
 *       200:
 *         description: the year of birth ot the user
 */
yop_rest.get("/calc_birth_year", (req, res) => {
    console.log("yop_rest: calc_year_birth: req.query.age: " + req.query.age);
    const q_age = parseInt(req.query.age);
    const r_birth_year = yop_core.calcBirthYear(q_age);
    res.send(r_birth_year.toString());
});

// the sugar
/**
 * @swagger
 * /call_activities:
 *   get:
 *     description: Returns statistics about the api activities
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: statistics
 */
yop_rest.get("/call_activities", (req, res) => {
    console.log("yop_rest: call_activities");
    res.json(yop_core.callActivities());
});

// ####################################
// main whole loop
// ####################################
// yop_rest.listen(yop_http_port, () => {
//    console.log('yop_rest: listening at http port '+ yop_http_port);
// });

https.createServer(ssl_options, yop_rest).listen(yop_https_port, () => {
    console.log("yop_rest_app: listening at https port " + yop_https_port);
});
