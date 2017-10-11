"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./configuration");
const serverObject_1 = require("./serverObject");
const apiObject_1 = require("./apiObject");
class ServerUser extends serverObject_1.ServerObject {
    constructor(app) {
        super(app);
        this.tableName = "user";
        this.idFieldName = "iduser";
        this.fields = null;
        this.adminToken = configuration_1.Configuration.get().authentification.adminToken;
    }
    assign() {
        this.assignObject("user", "iduser");
        let multer = require('multer');
        let upload = multer();
        this.app.put("/user/signup", upload.array(), (request, response) => {
            let usr = request.body.user;
            usr.validated = 0;
            let callback = (err, data) => {
                if (err) {
                    response.send(JSON.stringify(this.errorMessage(err)));
                }
                else {
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            };
            if (!usr) {
                response.send(this.errorMessage('Please define a user'));
            }
            let table = new apiObject_1.ApiObject(this.adminToken, this.tableName, this.idFieldName, this.fields);
            table.save(callback, usr);
        });
        this.app.post("/user/check", upload.array(), (request, response) => {
            let login = request.body.login;
            let callback = (err, data) => {
                if (err) {
                    response.send(JSON.stringify(this.errorMessage(err)));
                }
                else {
                    response.setHeader('content-type', 'application/json');
                    if (data && data.length > 0) {
                        response.send(JSON.stringify({ "found": true }));
                    }
                    else {
                        response.send(JSON.stringify({ "found": false }));
                    }
                }
            };
            if (!login) {
                response.send(this.errorMessage('Please define a login'));
            }
            let table = new apiObject_1.ApiObject(this.adminToken, this.tableName, this.idFieldName, this.fields);
            table.loadFromWhere(callback, "login='" + login + "'");
        });
    }
}
exports.ServerUser = ServerUser;
//# sourceMappingURL=serverUser.js.map