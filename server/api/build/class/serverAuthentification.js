"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
const toolbox_1 = require("./toolbox");
class ServerAuthentification {
    constructor(app) {
        this.app = app;
    }
    errorMessage(text) {
        return { "status": "ERR", "message": text };
    }
    assign() {
        toolbox_1.Toolbox.log("Authentification ==> API launched");
        this.app.get('/', function (request, response) {
            response.send('API Authentification is running');
        });
        let multer = require('multer');
        let upload = multer();
        this.app.post('/get', upload.array(), (request, response) => {
            let login = request.body.login;
            let password = request.body.password;
            let connexion = new connexion_1.Connexion();
            let callback = (err, data) => {
                if (err) {
                    toolbox_1.Toolbox.log("/get");
                    toolbox_1.Toolbox.log(err);
                    response.status(404);
                    response.send(JSON.stringify(this.errorMessage(err)));
                }
                else {
                    var jwt = require('jsonwebtoken');
                    let ret = connexion.checkJwt(data);
                    response.status(200);
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(ret));
                }
            };
            connexion.getJwt(callback, login, password);
        });
        this.app.post('/check', upload.array(), (request, response) => {
            let token = request.body.token;
            let jwt = require('jsonwebtoken');
            let connexion = new connexion_1.Connexion();
            let ret = connexion.checkJwt(token);
            response.setHeader('content-type', 'application/json');
            response.status(ret.token ? 200 : 404);
            response.send(JSON.stringify(ret));
            toolbox_1.Toolbox.log("/check");
            toolbox_1.Toolbox.log(JSON.stringify(ret));
        });
        this.app.post('/encrypt', upload.array(), (request, response) => {
            //            let token = request.body.token;
            let text = request.body.text;
            let connexion = new connexion_1.Connexion();
            let encrypt = connexion.encrypt(text);
            let ret = { "encrypted": encrypt };
            response.status(200);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(ret));
            toolbox_1.Toolbox.log("/crypt");
            toolbox_1.Toolbox.log(JSON.stringify(ret));
        });
        this.app.get('/check/:token', upload.array(), (request, response) => {
            let token = request.params.token;
            let jwt = require('jsonwebtoken');
            let connexion = new connexion_1.Connexion();
            let ret = connexion.checkJwt(token);
            response.status(ret.token ? 200 : 404);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(ret));
        });
    }
}
exports.ServerAuthentification = ServerAuthentification;
//# sourceMappingURL=serverAuthentification.js.map