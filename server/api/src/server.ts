import { toASCII } from 'punycode';
import express = require('express');

import { DatabaseTable } from "./class/databaseObjects";
import { Connexion } from "./class/connexion";
import { Toolbox } from "./class/toolbox";
import { ServerAuthentification } from "./class/serverAuthentification";
import { ServerObject } from "./class/serverObject";
import { ServerUser } from "./class/serverUser";
import { Configuration } from "./class/configuration";

let app = express();

// For POST-Support
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();
let port = Configuration.get().common.port;
app.use(bodyParser());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request methods you wish to allow    
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Credentials', 'true');// Set to true if you need the website to include cookies in the requests sent, to the API (e.g. in case you use sessions)

    // Pass to next layer of middleware
    next();
});

let connexion = new Connexion().tryConnectSql();

// Authentification
new ServerAuthentification(app).assign();

// User
new ServerUser(app).assign();

// Prescription
new ServerObject(app).assign("prescription", "idprescription");

// Prescription lines
new ServerObject(app).assign("prescriptionline", "idprescriptionline");

// Doc
new ServerObject(app).assign("doc", "iddoc");

// Doc descriptions
new ServerObject(app).assign("docdescription", "iddocdescription");

app.listen(port);
Toolbox.log("Listening port " + port.toString());