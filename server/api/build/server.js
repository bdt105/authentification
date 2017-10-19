"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dist_1 = require("bdt105connexion/dist");
const myToolbox_1 = require("./class/myToolbox");
const serverAuthentification_1 = require("./class/serverAuthentification");
const serverUser_1 = require("./class/serverUser");
let app = express();
// For POST-Support
let myToolbox = new myToolbox_1.MyToolbox();
let configuration = myToolbox.loadFromJsonFile("./conf/configuration.json");
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();
let port = configuration.common.port;
app.use(bodyParser());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request methods you wish to allow    
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Set to true if you need the website to include cookies in the requests sent, to the API (e.g. in case you use sessions)
    // Pass to next layer of middleware
    next();
});
let conn = new dist_1.Connexion(configuration.mySql, configuration.authentification);
conn.tryConnectSql();
// Authentification
new serverAuthentification_1.ServerAuthentification(app, conn).assign();
// User
new serverUser_1.ServerUser(app, conn).assign();
app.listen(port);
myToolbox.logg("Listening port " + port.toString());
//# sourceMappingURL=server.js.map