"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiObject_1 = require("./apiObject");
const MyToolbox_1 = require("./MyToolbox");
class ServerObject {
    constructor(app, connexion) {
        this.app = app;
        this.connexion = connexion;
        this.myToolbox = new MyToolbox_1.MyToolbox();
    }
    errorMessage(text) {
        return { "status": "ERR", "message": text };
    }
    verifyToken(token) {
        if (token) {
            return this.connexion.isTokenValid(token);
        }
        else {
            return false;
        }
    }
    assign(tableName, idFieldName, fields = null) {
        this.assignObject(tableName, idFieldName, fields);
    }
    assignObject(tableName, idFieldName, fields = null) {
        this.myToolbox.logg(tableName + " ==> API launched");
        this.app.get('/', function (request, response) {
            response.send('API Authentification is running');
        });
        let multer = require('multer');
        let upload = multer();
        this.app.post('/' + tableName + 's', upload.array(), (request, response) => {
            let token = request.body.token;
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
            if (!this.verifyToken(token)) {
                response.send(this.errorMessage("Token is absent or invalid"));
                return;
            }
            let table = new apiObject_1.ApiObject(this.connexion, tableName, idFieldName, fields);
            table.loadFromWhere(callback, where, limit, offset);
        });
        this.app.put('/' + tableName, upload.array(), (request, response) => {
            let token = request.body.token;
            let usr = request.body.user;
            let callback = (err, data) => {
                if (err) {
                    response.send(JSON.stringify(this.errorMessage(err)));
                }
                else {
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            };
            if (!this.verifyToken(token)) {
                response.send(this.errorMessage('Token is absent or invalid'));
                return;
            }
            if (!usr) {
                response.send(this.errorMessage('Please define a ' + tableName));
                return;
            }
            let table = new apiObject_1.ApiObject(this.connexion, tableName, idFieldName, fields);
            table.save(callback, usr);
        });
        this.app.post('/' + tableName + '/fresh', upload.array(), (request, response) => {
            let token = request.body.token;
            let callback = (err, data) => {
                if (err) {
                    response.send(JSON.stringify(this.errorMessage(err)));
                }
                else {
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            };
            if (!this.verifyToken(token)) {
                response.send(this.errorMessage('Token is absent or invalid'));
                return;
            }
            let table = new apiObject_1.ApiObject(this.connexion, tableName, idFieldName, fields);
            table.fresh(callback);
        });
        this.app.delete('/' + tableName, upload.array(), (request, response) => {
            let token = request.body.token;
            let id = request.body.id;
            let callback = (err, data) => {
                if (err) {
                    response.send(JSON.stringify(this.errorMessage(err)));
                }
                else {
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            };
            if (!this.verifyToken(token)) {
                response.send(this.errorMessage('Token is absent or invalid'));
                return;
            }
            if (!id) {
                response.send(this.errorMessage('Please define an id'));
                return;
            }
            let table = new apiObject_1.ApiObject(this.connexion, tableName, idFieldName, fields);
            table.deleteFromId(callback, id);
        });
    }
}
exports.ServerObject = ServerObject;
//# sourceMappingURL=serverObjectOld.js.map