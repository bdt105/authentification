"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
const user_1 = require("./user");
class AuthentificationServer {
    constructor(app) {
        this.app = app;
        this.app.get('/auth/', function (request, response) {
            response.send('API Authentification');
        });
        let multer = require('multer');
        let upload = multer();
        app.post('/auth/get', upload.array(), (request, response) => {
            let login = request.body.login;
            let password = request.body.password;
            let connexion = new connexion_1.Connexion();
            let callback = function (err, data) {
                if (err) {
                    response.send(JSON.stringify(err));
                }
                else {
                    var jwt = require('jsonwebtoken');
                    let ret = connexion.checkJwt(data);
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(ret));
                }
            };
            connexion.getJwt(callback, login, password);
        });
        app.post('/auth/check', upload.array(), (request, response) => {
            let token = request.body.token;
            let jwt = require('jsonwebtoken');
            let connexion = new connexion_1.Connexion();
            let ret = connexion.checkJwt(token);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(ret));
        });
        app.get('/auth/check/:token', upload.array(), (request, response) => {
            let token = request.params.token;
            let jwt = require('jsonwebtoken');
            let connexion = new connexion_1.Connexion();
            let ret = connexion.checkJwt(token);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(ret));
        });
        // Users
        app.post('/auth/users', upload.array(), (request, response) => {
            let token = request.body.token;
            let id = request.body.id;
            let where = request.body.filter;
            let limit = request.body.limit;
            let offset = request.body.offset;
            let callback = function (err, data) {
                if (err) {
                    response.send(JSON.stringify(err));
                }
                else {
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            };
            let users = new user_1.User(token);
            users.loadFromWhere(callback, where, limit, offset);
        });
        app.put('/auth/user', upload.array(), (request, response) => {
            let token = request.body.token;
            let usr = request.body.user;
            let callback = function (err, data) {
                if (err) {
                    response.send(JSON.stringify(err));
                }
                else {
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            };
            let user = new user_1.User(token);
            user.save(callback, usr);
        });
        app.delete('/auth/user', upload.array(), (request, response) => {
            let token = request.body.token;
            let id = request.body.id;
            let callback = function (err, data) {
                if (err) {
                    response.send(JSON.stringify(err));
                }
                else {
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            };
            let user = new user_1.User(token);
            user.deleteFromId(callback, id);
        });
    }
}
exports.AuthentificationServer = AuthentificationServer;
//# sourceMappingURL=authentification.js.map