"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connexion_1 = require("./class/connexion");
const toolbox_1 = require("./class/toolbox");
const serverAuthentification_1 = require("./class/serverAuthentification");
const serverObject_1 = require("./class/serverObject");
const serverUser_1 = require("./class/serverUser");
const configuration_1 = require("./class/configuration");
let app = express();
// For POST-Support
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();
let port = configuration_1.Configuration.get().common.port;
app.use(bodyParser());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request methods you wish to allow    
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Set to true if you need the website to include cookies in the requests sent, to the API (e.g. in case you use sessions)
    // Pass to next layer of middleware
    next();
});
let connexion = new connexion_1.Connexion().tryConnectSql();
// Authentification
new serverAuthentification_1.ServerAuthentification(app).assign();
// User
new serverUser_1.ServerUser(app).assign();
// Prescription
new serverObject_1.ServerObject(app).assign("prescription", "idprescription");
// Prescription lines
new serverObject_1.ServerObject(app).assign("prescriptionline", "idprescriptionline");
// Doc
new serverObject_1.ServerObject(app).assign("doc", "iddoc");
// Doc descriptions
new serverObject_1.ServerObject(app).assign("docdescription", "iddocdescription");
app.listen(port);
toolbox_1.Toolbox.log("Listening port " + port.toString());
//# sourceMappingURL=server.js.map