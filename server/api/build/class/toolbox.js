"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./configuration");
const bdt105toolbox_1 = require("bdt105toolbox");
class MyToolbox {
}
MyToolbox.log = function (text) {
    if (configuration_1.Configuration.get().common.logToFile && configuration_1.Configuration.get().common.logFile) {
        var fs = require('fs');
        let t = new bdt105toolbox_1.Toolbox();
        var dateTime = t.formatDate(new Date());
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
exports.MyToolbox = MyToolbox;
//# sourceMappingURL=toolbox.js.map