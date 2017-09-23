"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Global {
}
Global.mySql = {
    "host": "localhost",
    "user": "root",
    "port": "3306",
    "password": "",
    "database": "authentification"
};
Global.authentification = {
    "secret": "dere1234",
    "salt": "$2a$10$Vn/zPCM8sSSaYnRmggV4CO",
    "userRequestEmail": "bernard.deregnaucourt@vidal.fr"
};
Global.common = {
    port: 4000,
    logToFile: true,
    logToConsole: true,
    logFile: "authentification.log"
};
exports.Global = Global;
//# sourceMappingURL=global.js.map