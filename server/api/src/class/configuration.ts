export class Configuration {
    
    private static fileName ="./conf/configuration.json";
    private static encoding ="utf8";

    static get(){
        var fs = require('fs');
        
        var conf = fs.readFileSync(Configuration.fileName, Configuration.encoding);
        return JSON.parse(conf);
    }
    
}