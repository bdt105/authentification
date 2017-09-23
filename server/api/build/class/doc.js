"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
const databaseObjects_1 = require("./databaseObjects");
class Doc {
    constructor(token, loadDescriptions = false) {
        this.tableName1 = "doc";
        this.idFieldName1 = "iddoc";
        this.tableName2 = "docdescription";
        this.idFieldName2 = "iddocdescription";
        this.orderby = this.tableName1 + "." + this.idFieldName1;
        this.fields1 = ["iddoc", "path", "summary", "method", "grp", "link", "creationDate", "updateDate", "availability", "body", "parameters", "returns", "special", "position"];
        this.fields2 = ["iddocdescription", "iddoc", "language", "name", "detail", "description", "typ", "keyWords"];
        this.connexion = new connexion_1.Connexion();
        this.token = token;
        this.loadDescriptions = loadDescriptions;
        let databaseObject = new databaseObjects_1.DatabaseObject("");
        this.extra =
            (this.loadDescriptions ? " LEFT JOIN prescriptionline ON (" + this.tableName1 + "." + this.idFieldName1 + "=prescriptionline.idprescription)" : "");
        this.select = databaseObject.fieldsToString(this.tableName1, this.fields1) +
            (this.loadDescriptions ? ", " + databaseObject.fieldsToString(this.tableName2, this.fields2) : "");
    }
    callbackLoad(err, rows, callback) {
        if (rows) {
            let ret = this.format(rows);
            callback(err, ret);
        }
        else {
            callback(err, rows);
        }
    }
    load(callback, where) {
        let objects = new databaseObjects_1.DatabaseRecordset(this.token, this.select, this.tableName1, this.extra, where, this.orderby);
        objects.load((err, rows) => this.callbackLoad(err, rows, callback));
    }
    loadFromUser(callback, userId) {
        if (userId) {
            this.load(callback, this.tableName1 + ".iduser='" + userId + "'");
        }
        else {
            this.error = "User Id is mandatory";
            callback(this.error, null);
        }
    }
    loadFromId(callback, id) {
        if (id) {
            this.load(callback, this.tableName1 + "." + this.idFieldName1 + "='" + id + "'");
        }
        else {
            this.error = "Id is mandatory";
            callback(this.error, null);
        }
    }
    deleteFormIdCallback(err, rows, callback, id) {
        if (err) {
            callback(err, rows);
        }
        else {
            let object = new databaseObjects_1.DatabaseTable(this.token, this.tableName2, this.idFieldName2);
            object.deleteFromId((err, rows) => callback(err, rows), id.toString());
        }
    }
    deleteFromId(callback, id) {
        if (id) {
            let objects = new databaseObjects_1.DatabaseTable(this.token, "docdescription", "iddocdescription");
            objects.deleteFromId((err, rows) => this.deleteFormIdCallback(err, rows, callback, id), id.toString());
        }
        else {
            this.error = "Id is mandatory";
            callback(this.error, null);
        }
    }
    save(callback, id, body) {
        if (id) {
            let prescriptions = new databaseObjects_1.DatabaseTable(this.token, this.tableName1, this.idFieldName1);
            prescriptions.save(callback, body, id.toString());
        }
        else {
            this.error = "Id is mandatory";
            callback(this.error, null);
        }
    }
    format(rows) {
        if (rows && rows.length > 0) {
            var prescriptions = [];
            var prescriptionIdOld = -1;
            var prescriptionId = null;
            var prescription;
            var prescriptionLine;
            var patient;
            var found;
            for (let i = 0; i < rows.length; i++) {
                prescriptionId = rows[i].prescription_idprescription;
                found = prescriptions.find((element) => {
                    return (element.prescription ? element.prescription.idprescription == prescriptionId : false);
                });
                if (!found) {
                    found = {};
                    prescriptions.push(found);
                }
                for (var field in rows[i]) {
                    if (field.startsWith("patient_")) {
                        if (!found.patient) {
                            found.patient = {};
                        }
                        found.patient[field.replace("patient_", "")] = rows[i][field];
                    }
                    if (field.startsWith("prescription_")) {
                        if (!found.prescription) {
                            found.prescription = {};
                        }
                        found.prescription[field.replace("prescription_", "")] = rows[i][field];
                    }
                    if (field.startsWith("prescriptionline_")) {
                        if (!found.prescriptionLines) {
                            found.prescriptionLines = [];
                        }
                        var prescriptionLineId = rows[i].prescriptionline_idprescriptionline;
                        var prescriptionLine = found.prescriptionLines.find((element) => {
                            return element.idprescriptionline == prescriptionLineId;
                        });
                        if (!prescriptionLine) {
                            prescriptionLine = {};
                            found.prescriptionLines.push(prescriptionLine);
                        }
                        prescriptionLine[field.replace("prescriptionline_", "")] = rows[i][field];
                    }
                }
            }
            return prescriptions;
        }
    }
}
exports.Doc = Doc;
//# sourceMappingURL=doc.js.map