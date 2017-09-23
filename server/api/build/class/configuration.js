"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Configuration {
    static get() {
        var fs = require('fs');
        var conf = fs.readFileSync(Configuration.fileName, Configuration.encoding);
        return JSON.parse(conf);
    }
}
Configuration.fileName = "./conf/configuration.json";
Configuration.encoding = "utf8";
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map