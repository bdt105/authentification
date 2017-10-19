"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databaseObject_1 = require("./databaseObject");
class ApiObject {
    constructor(connexion, tableName, idFielName, fields = null) {
        this.tableName = tableName;
        this.idFieldName = idFielName;
        this.fields = fields;
        this.connexion = connexion;
        let databaseObject = new databaseObject_1.DatabaseObject(this.connexion);
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
        let objects = new databaseObject_1.DatabaseRecordset(this.connexion, { "select": this.select, "from": this.tableName, "extra": this.extra, "where": where, "orderby": this.orderby, "limit": limit, "offset": offset, "groupby": null, "idFieldName": null });
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
            let objects = new databaseObject_1.DatabaseTable(this.connexion, this.tableName, this.idFieldName);
            objects.deleteFromId((err, rows) => callback(err, rows, callback, id), id.toString());
        }
        else {
            this.error = "Id is mandatory";
            callback(this.error, null);
        }
    }
    save(callback, body) {
        let object = new databaseObject_1.DatabaseTable(this.connexion, this.tableName, this.idFieldName);
        object.save(callback, body, body[this.idFieldName] ? body[this.idFieldName].toString() : null);
    }
    newTemporary(callback, body) {
        let object = new databaseObject_1.DatabaseTable(this.connexion, this.tableName, this.idFieldName);
        object.save(callback, body, body[this.idFieldName] ? body[this.idFieldName].toString() : null);
    }
    fresh(callback) {
        let object = new databaseObject_1.DatabaseTable(this.connexion, this.tableName, this.idFieldName);
        object.fresh(callback);
    }
}
exports.ApiObject = ApiObject;
//# sourceMappingURL=apiObjectOld.js.map