"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
const databaseObjects_1 = require("./databaseObjects");
class DocDescription {
    constructor(token, loadLines = false, loadPatient = false) {
        this.tableName = "prescription";
        this.idFieldName = "idprescription";
        this.orderby = "prescription.idprescription";
        this.selectPrescription = `
    prescription.idprescription prescription_idprescription, 
    prescription.idpatient prescription_idpatient, 
    prescription.user prescription_user, 
    prescription.creationDate prescription_creationDate, 
    prescription.updateDate prescription_updateDate`;
        this.selectPrescritionline = `
    prescriptionline.idprescriptionline prescriptionline_idprescriptionline,
    prescriptionline.idprescription prescriptionline_idprescription,
    prescriptionline.productId prescriptionline_productId,
    prescriptionline.productCode prescriptionline_productCode,
    prescriptionline.productName prescriptionline_productName,
    prescriptionline.productDetail prescriptionline_productDetail,
    prescriptionline.unitId prescriptionline_unitId,
    prescriptionline.unitName prescriptionline_unitName,
    prescriptionline.productType prescriptionline_productType,
    prescriptionline.durationType prescriptionline_durationType,
    prescriptionline.frequencyType prescriptionline_frequencyType,
    prescriptionline.dose prescriptionline_dose,
    prescriptionline.duration prescriptionline_duration,
    prescriptionline.routeId prescriptionline_routeId,
    prescriptionline.routeName prescriptionline_routeName,
    prescriptionline.galenicFormId prescriptionline_galenicFormId,
    prescriptionline.galenicFormName prescriptionline_galenicFormName,
    prescriptionline.summary prescriptionline_summary,
    prescriptionline.indicationIds prescriptionline_indicationIds,
    prescriptionline.moments prescriptionline_moments,
    prescriptionline.days prescriptionline_days,
    prescriptionline.onDemand prescriptionline_onDemand,
    prescriptionline.comment prescriptionline_comment,
    prescriptionline.momentDoses prescriptionline_momentDoses,
    prescriptionline.atcClass prescriptionline_atcClass,
    prescriptionline.vidalClass prescriptionline_vidalClass`;
        this.selectPatient = `
    patient.idpatient patient_idpatient,
    patient.dateOfBirth patient_dateOfBirth,
    patient.gender patient_gender,
    patient.weight patient_weight,
    patient.height patient_height,
    patient.weeksOfAmenorrhea patient_weeksOfAmenorrhea,
    patient.breastFeeding patient_breastFeeding,
    patient.creatin patient_creatin,
    patient.hepaticInsufficiency patient_hepaticInsufficiency,
    patient.user patient_user,
    patient.name patient_name,
    patient.allergyIds patient_allergyIds,
    patient.moleculeIds patient_moleculeIds,
    patient.cim10Ids patient_cim10Ids,
    patient.firstName patient_firstName,
    patient.record patient_record,
    patient.text patient_text,
    patient.cim10Codes patient_cim10Codes
    `;
        this.connexion = new connexion_1.Connexion();
        this.token = token;
        this.loadLines = loadLines;
        this.loadPatient = loadPatient;
        this.extra =
            (this.loadLines ? " LEFT JOIN prescriptionline ON (" + this.tableName + "." + this.idFieldName + "=prescriptionline.idprescription)" : "") +
                (this.loadPatient ? " LEFT JOIN patient ON (prescription.idpatient = patient.idpatient)" : "");
        this.select = this.selectPrescription +
            (this.loadLines ? ", " + this.selectPrescritionline : "") +
            (this.loadPatient ? ", " + this.selectPatient : "");
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
        let prescriptions = new databaseObjects_1.DatabaseRecordset(this.token, this.select, this.tableName, this.extra, where, this.orderby);
        prescriptions.load((err, rows) => this.callbackLoad(err, rows, callback));
    }
    loadFromUser(callback, user) {
        if (user) {
            this.load(callback, this.tableName + ".user='" + user + "'");
        }
        else {
            this.error = "User is mandatory";
            callback(this.error, null);
        }
    }
    loadFromId(callback, id) {
        if (id) {
            this.load(callback, this.tableName + "." + this.idFieldName + "='" + id + "'");
        }
        else {
            this.error = "User is mandatory";
            callback(this.error, null);
        }
    }
    deleteFormIdCallback(err, rows, callback, id) {
        if (err) {
            callback(err, rows);
        }
        else {
            let prescription = new databaseObjects_1.DatabaseTable(this.token, this.tableName, this.idFieldName);
            prescription.deleteFromId((err, rows) => callback(err, rows), "idprescription", id.toString());
        }
    }
    deleteFromId(callback, id) {
        if (id) {
            let prescriptionline = new databaseObjects_1.DatabaseTable(this.token, "prescriptionline", "idprescriptionline");
            prescriptionline.deleteFromId((err, rows) => this.deleteFormIdCallback(err, rows, callback, id), "idprescription", id.toString());
        }
        else {
            this.error = "Id is mandatory";
            callback(this.error, null);
        }
    }
    save(callback, id, body) {
        if (id) {
            let prescriptions = new databaseObjects_1.DatabaseTable(this.token, this.tableName, this.idFieldName);
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
exports.DocDescription = DocDescription;
//# sourceMappingURL=docDescription.js.map