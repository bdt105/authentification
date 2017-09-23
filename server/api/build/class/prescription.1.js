"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
const databaseObjects_1 = require("./databaseObjects");
const databaseObjects_2 = require("./databaseObjects");
class Prescription {
    constructor(user, loadLines = false, loadPatient = false) {
        this.connexion = new connexion_1.Connexion();
        this.user = user;
        this.loadLines = loadLines;
        this.loadPatient = loadPatient;
        this.extra =
            (this.loadLines ? " LEFT JOIN prescriptionline ON (prescription.idprescription = prescriptionline.idprescription)" : "") +
                (this.loadPatient ? " LEFT JOIN patient ON (prescription.idpatient = patient.idpatient)" : "");
        this.select = "prescription.*" +
            (this.loadLines ? ", '__lines', prescriptionLine.*" : "") +
            (this.loadPatient ? ", '__patient', patient.*" : "");
    }
    load(callback) {
        if (this.user) {
            let prescriptions = new databaseObjects_1.DatabaseRecordset(this.select, "prescription", this.extra);
            let fieldValue = new databaseObjects_2.FieldValue();
            fieldValue.fieldName = "prescription.user";
            fieldValue.value = this.user;
            let fieldValues = [];
            fieldValues.push(fieldValue);
            prescriptions.select(fieldValues, (err, rows) => callback(err, rows));
        }
        else {
            this.error = "User is mandatory";
            callback(this.error, null);
        }
    }
    loadFromId(callback, id) {
        if (id) {
            let prescriptions = new databaseObjects_1.DatabaseRecordset("*", "prescription", this.extra);
            let fieldValue = new databaseObjects_2.FieldValue();
            fieldValue.fieldName = "prescription.idprescription";
            fieldValue.value = id + "";
            let fieldValues = [];
            fieldValues.push(fieldValue);
            prescriptions.select(fieldValues, (err, rows) => callback(err, rows));
        }
        else {
            this.error = "Id is mandatory";
            callback(this.error, null);
        }
    }
    format(rows) {
        if (rows && rows.length > 0) {
        }
    }
}
exports.Prescription = Prescription;
//# sourceMappingURL=prescription.1.js.map