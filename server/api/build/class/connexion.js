"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("bdt105configuration/dist");
const myToolbox_1 = require("./myToolbox");
class Connexion {
    constructor(jwtSecretKey = null) {
        this.jwtStatusOk = "OK";
        this.jwtStatusERR = "ERR";
        this.jwtSecretKey = jwtSecretKey;
        if (!this.jwtSecretKey) {
            this.jwtSecretKey = dist_1.Configuration.get().authentification.secret;
        }
        this.mySql = require('mysql');
        this.jsonwebtoken = require('jsonwebtoken');
    }
    connectSql() {
        this.sqlConnexion = this.mySql.createConnection({
            "host": dist_1.Configuration.get().mySql.host,
            "user": dist_1.Configuration.get().mySql.user,
            "port": dist_1.Configuration.get().mySql.port,
            "password": dist_1.Configuration.get().mySql.password,
            "database": dist_1.Configuration.get().mySql.database
        });
        if (this.sqlConnexion) {
            let err = this.sqlConnexion.connect((err) => this.callbackConnect(err));
        }
    }
    releaseSql() {
        if (this.sqlConnexion) {
            myToolbox_1.MyToolbox.log('Connexion to the database as id ' + this.sqlConnexion.threadId + ' ended !');
            this.sqlConnexion.end();
            this.sqlConnexion = null;
        }
    }
    callbackConnect(err) {
        this.err = err;
        if (err) {
            console.error('error connecting: ' + err.stack);
            this.releaseSql();
            return;
        }
        myToolbox_1.MyToolbox.log('Connected to the database as id ' + this.sqlConnexion.threadId);
    }
    callbackGetJwt(callback, err, rows, plainPassword) {
        this.rows = rows;
        this.err = err;
        let user = {};
        let jwt = null;
        this.releaseSql();
        if (rows && rows.length > 0) {
            let encryptedPassword = this.encrypt(plainPassword);
            user = rows[0];
            if (encryptedPassword === user.password) {
                user.password = null;
                jwt = this.jsonwebtoken.sign(user, this.jwtSecretKey);
                callback(err, jwt);
            }
            else {
                callback("Wrong password or login", jwt);
            }
        }
        else {
            if (callback) {
                callback(err, jwt);
            }
        }
    }
    callbackQuerySql(callback, err, rows) {
        this.releaseSql();
        if (callback) {
            callback(err, rows);
        }
    }
    querySql(callback, sql, token) {
        this.connectSql();
        if (token && this.isTokenValid(token)) {
            this.sqlConnexion.query(sql, (err, rows) => this.callbackQuerySql(callback, err, rows));
        }
        else {
            callback({ "err": "invalid token" }, undefined);
        }
    }
    getJwt(callback, login, plainPassword) {
        this.connectSql();
        if (this.sqlConnexion) {
            let sql = "select * from user where validated = 1 and login = '" + login + "'";
            this.sqlConnexion.query(sql, (err, rows) => this.callbackGetJwt(callback, err, rows, plainPassword));
        }
    }
    checkJwt(token) {
        var jwt = require('jsonwebtoken');
        try {
            var decoded = jwt.verify(token, this.jwtSecretKey);
            if (decoded.iduser) {
                myToolbox_1.MyToolbox.log("User Id: " + decoded.iduser + ", login: " + decoded.login);
            }
            return { "token": token, "status": this.jwtStatusOk, "decoded": decoded };
        }
        catch (err) {
            return { "token": token, "status": this.jwtStatusERR, "decoded": null };
        }
    }
    isTokenValid(token) {
        let jwt = this.checkJwt(token);
        if (jwt) {
            return jwt.status == this.jwtStatusOk;
        }
        else {
            return false;
        }
    }
    encrypt(plain) {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, dist_1.Configuration.get().authentification.salt);
        return hash;
    }
    compareEncrypt(encrypted, plain) {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, dist_1.Configuration.get().authentification.salt);
        return hash === encrypted;
    }
    tryConnectSql() {
        this.connectSql();
    }
}
exports.Connexion = Connexion;
//# sourceMappingURL=connexion.js.map