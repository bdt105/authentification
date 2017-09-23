"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
const databaseObjects_1 = require("./databaseObjects");
class ApiObject {
    constructor(token, tableName, idFielName, fields = null) {
        this.tableName = tableName;
        this.idFieldName = idFielName;
        this.fields = fields;
        this.connexion = new connexion_1.Connexion();
        this.token = token;
        let databaseObject = new databaseObjects_1.DatabaseObject("");
        this.orderby = this.tableName + "." + this.idFieldName;
        this.select = (fields ? databaseObject.fieldsToString(this.tableName, this.fields, false) : "*");
    }
    callbackLoad(err, rows, callback) {
        if (rows) {
            let ret = rows;
            callback(err, ret);
        }
        else {
            callback(err, rows);
        }
    }
    loadFromWhere(callback, where, limit = null, offset = null) {
        let objects = new databaseObjects_1.DatabaseRecordset(this.token, { "select": this.select, "from": this.tableName, "extra": this.extra, "where": where, "orderby": this.orderby, "limit": limit, "offset": offset });
        objects.load((err, rows) => this.callbackLoad(err, rows, callback));
    }
    loadFromId(callback, id) {
        if (id) {
            this.loadFromWhere(callback, this.tableName + "." + this.idFieldName + "='" + id + "'");
        }
        else {
            this.error = "Id is mandatory";
            callback(this.error, null);
        }
    }
    deleteFromId(callback, id) {
        if (id) {
            let objects = new databaseObjects_1.DatabaseTable(this.token, this.tableName, this.idFieldName);
            objects.deleteFromId((err, rows) => callback(err, rows, callback, id), id.toString());
        }
        else {
            this.error = "Id is mandatory";
            callback(this.error, null);
        }
    }
    save(callback, body) {
        let object = new databaseObjects_1.DatabaseTable(this.token, this.tableName, this.idFieldName);
        object.save(callback, body, body[this.idFieldName] ? body[this.idFieldName].toString() : null);
    }
    newTemporary(callback, body) {
        let object = new databaseObjects_1.DatabaseTable(this.token, this.tableName, this.idFieldName);
        object.save(callback, body, body[this.idFieldName] ? body[this.idFieldName].toString() : null);
    }
    fresh(callback) {
        let object = new databaseObjects_1.DatabaseTable(this.token, this.tableName, this.idFieldName);
        object.fresh(callback);
    }
}
exports.ApiObject = ApiObject;
//# sourceMappingURL=apiObject.js.map