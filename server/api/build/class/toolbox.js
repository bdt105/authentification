"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./configuration");
class Toolbox {
    static getConfiguration() {
    }
    static dateToDbString(date) {
        return date.getFullYear() + "-" +
            (date.getMonth().toString().length < 2 ? "0" : "") + date.getMonth() + "-" +
            (date.getDay().toString().length < 2 ? "0" : "") + date.getDay() + " " +
            (date.getHours().toString().length < 2 ? "0" : "") + date.getHours() + ":" +
            (date.getMinutes().toString().length < 2 ? "0" : "") + date.getMinutes() + ":" +
            (date.getSeconds().toString().length < 2 ? "0" : "") + date.getSeconds();
    }
    static isoDateToDbString(date) {
        return date.substring(0, 19).replace("T", " ");
    }
}
Toolbox.log = function (text) {
    if (configuration_1.Configuration.get().common.logToFile && configuration_1.Configuration.get().common.logFile) {
        var fs = require('fs');
        var dateTime = Toolbox.formatDate(new Date());
        let txt = "---------------\r\n" + dateTime + "\r\n" + text + "\r\n";
        fs.appendFile(configuration_1.Configuration.get().common.logFile, txt, function (err) {
            if (err) {
                // Do nothing if can't log
                // throw err;
            }
            if (configuration_1.Configuration.get().common.logToConsole) {
                console.log(txt);
            }
        });
    }
};
Toolbox.formatDate = function (date) {
    var year = date.getFullYear(), month = date.getMonth() + 1, // months are zero indexed
    day = date.getDate(), hour = date.getHours(), minute = date.getMinutes(), second = date.getSeconds(), hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
    minuteFormatted = minute < 10 ? "0" + minute : minute, morning = hour < 12 ? "am" : "pm";
    return month + "/" + day + "/" + year + " " + hourFormatted + ":" + minute + ":" + second;
    //minuteFormatted + morning;
};
exports.Toolbox = Toolbox;
//# sourceMappingURL=toolbox.js.map