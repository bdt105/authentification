"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
const toolbox_1 = require("./toolbox");
class FieldValue {
}
exports.FieldValue = FieldValue;
class DatabaseObject {
    constructor(token) {
        this.connexion = new connexion_1.Connexion();
        this.token = token;
    }
    query(callback, sql) {
        if (this.connexion) {
            toolbox_1.Toolbox.log(sql);
            this.connexion.querySql((err, rows) => callback(err, rows), sql, this.token);
        }
    }
    getWhereString(fieldValues, defaultLogicoperator = "AND", defaultComparisonOperator = "=") {
        var ret = "";
        if (fieldValues) {
            for (var i = 0; i < fieldValues.length; i++) {
                ret += (ret != "" ? (fieldValues[i].logicOperator ? " " + fieldValues[i].logicOperator + " " : " AND ") : "") +
                    fieldValues[i].fieldName + (fieldValues[i].comparisonOperator ? fieldValues[i].comparisonOperator : "=") + "'" + fieldValues[i].value + "'";
            }
        }
        return ret;
    }
    fieldsToString(tableName, fields, alias = true) {
        var ret = "";
        for (var i = 0; i < fields.length; i++) {
            ret += (ret == "" ? "" : ", ") + (alias ? tableName + "." : "") + fields[i] + (alias ? " " + tableName + "_" + fields[i] : "");
        }
        return ret;
    }
}
exports.DatabaseObject = DatabaseObject;
class DatabaseRecordset extends DatabaseObject {
    constructor(token, attributes) {
        super(token);
        this.attributes = attributes;
    }
    getSqlend() {
        let sqlEnd = (this.attributes.where ? " WHERE " + this.attributes.where : '') +
            (this.attributes.groupby ? " GROUP BY " + this.attributes.groupby : "") +
            (this.attributes.orderby ? " ORDER BY " + this.attributes.orderby : "") +
            (this.attributes.limit ? " LIMIT " + this.attributes.limit : "") +
            (this.attributes.offset ? " OFFSET " + this.attributes.offset : "");
        return sqlEnd;
    }
    getSql() {
        return "SELECT " + this.attributes.select + " FROM " + this.attributes.from + (this.attributes.extra ? " " + this.attributes.extra : "") + this.getSqlend();
    }
    whereString(fieldValues, defaultLogicoperator = "AND", defaultComparisonOperator = "=") {
        var ret = "";
        if (fieldValues) {
            for (var i = 0; i < fieldValues.length; i++) {
                ret += (ret != "" ? (fieldValues[i].logicOperator ? " " + fieldValues[i].logicOperator + " " : " AND ") : "") +
                    fieldValues[i].fieldName + (fieldValues[i].comparisonOperator ? fieldValues[i].comparisonOperator : "=") + "'" + fieldValues[i].value + "'";
            }
        }
        return ret;
    }
    load(callback) {
        this.query((err, rows) => callback(err, rows), this.getSql());
    }
}
exports.DatabaseRecordset = DatabaseRecordset;
class DatabaseTable extends DatabaseRecordset {
    constructor(token, tableName, idFieldName) {
        super(token, { "select": "*", "from": tableName, "idFieldName": idFieldName });
        this.tableName = tableName;
        this.idFieldName = idFieldName;
    }
    callbackSearch(err, rows, prefix, operator, q, callback) {
        let searchString = "";
        for (var i = 0; i < rows.length; i++) {
            searchString += (searchString == "" ? "" : " " + operator + " ") + rows[i].Field + prefix.replace("[]", q);
        }
        if (callback) {
            this.attributes.where = searchString;
            this.query((err, rows) => callback(err, rows), this.getSql());
        }
    }
    loadFromId(callback, id) {
        this.attributes.where = this.attributes.idFieldName + "='" + id + "'";
        this.query((err, rows) => callback(err, rows), this.getSql());
    }
    loadFromWhere(callback, where) {
        this.attributes.where = where;
        this.query((err, rows) => callback(err, rows), this.getSql());
    }
    search(callback, q, prefix, suffix) {
        if (q) {
            this.query((err, rows) => this.callbackSearch(err, rows, prefix, suffix, q, callback), "SHOW FIELDS FROM " + this.attributes.from);
        }
        else {
            this.query((err, rows) => callback(err, rows), this.getSql());
        }
    }
    insertString(body) {
        let values = "";
        let fields = "";
        for (var name in body) {
            fields += (values == "" ? "" : ", ") + name;
            values += (values == "" ? "" : ", ") + (body[name] === null ? "null" : "'" + body[name] + "'");
        }
        return "(" + fields + ") " + " VALUES (" + values + ")";
    }
    insert(callback, body) {
        let sql = "INSERT INTO " + this.attributes.from + this.insertString(body);
        this.query((err, rows) => callback(err, rows), sql);
    }
    deleteFromField(callback, fieldName, value) {
        let where = fieldName + "='" + value + "'";
        this.deleteFromWhere((err, rows) => callback(err, rows), where);
    }
    deleteFromId(callback, value) {
        let where = this.attributes.idFieldName + "='" + value + "'";
        this.deleteFromWhere((err, rows) => callback(err, rows), where);
    }
    deleteFromWhere(callback, where) {
        let sql = "DELETE FROM " + this.attributes.from + " WHERE " + where;
        this.query((err, rows) => callback(err, rows), sql);
    }
    updateString(body) {
        let st = "";
        let update = false;
        for (var name in body) {
            st += (st == "" ? "" : ", ") + (body[name] === null ? name + "=null" : name + "='" + body[name] + "'");
        }
        return st;
    }
    update(callback, body, where) {
        let sql = "UPDATE " + this.attributes.from + " SET " + this.updateString(body) + " WHERE " + where;
        this.query((err, rows) => callback(err, rows), sql);
    }
    callbackUnique(callback, body, id, err, rows) {
        if (rows && rows.length > 0) {
            let where = this.attributes.idFieldName + "='" + id + "'";
            this.update(callback, body, where);
        }
        else {
            this.insert(callback, body);
        }
    }
    save(callback, body, id) {
        let where = this.attributes.idFieldName + "='" + id + "'";
        let sql = "SELECT * FROM " + this.attributes.from + " WHERE " + where;
        this.query((err, rows) => this.callbackUnique(callback, body, id, err, rows), sql);
    }
    callbackFresh(err, rows, callback) {
        let body = {};
        if (rows) {
            for (var i = 0; i < rows.length; i++) {
                body[rows[i].Field] = "";
            }
        }
        if (callback) {
            let arr = [];
            arr.push(body);
            callback(err, arr);
        }
    }
    fresh(callback) {
        let sql = "SHOW FIELDS FROM " + this.attributes.from;
        this.query((err, rows) => this.callbackFresh(err, rows, callback), sql);
    }
}
exports.DatabaseTable = DatabaseTable;
//# sourceMappingURL=databaseObjects.js.map