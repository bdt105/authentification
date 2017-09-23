import { Configuration } from "./configuration";

export class Toolbox {
    public static log = function (text: string){
        if (Configuration.get().common.logToFile && Configuration.get().common.logFile){
            var fs = require('fs');
            var dateTime = Toolbox.formatDate(new Date());
            let txt = "---------------\r\n" + dateTime + "\r\n" + text + "\r\n";
            fs.appendFile(Configuration.get().common.logFile, txt, function (err: any) {
                if (err) {
                    // Do nothing if can't log
                    // throw err;
                }
                if (Configuration.get().common.logToConsole){
                    console.log(txt);
                }
            });
        }
    }

    static formatDate = function(date: Date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1, // months are zero indexed
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds(),
            hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
            minuteFormatted = minute < 10 ? "0" + minute : minute,
            morning = hour < 12 ? "am" : "pm";
    
        return month + "/" + day + "/" + year + " " + hourFormatted + ":" + minute + ":" + second;
                //minuteFormatted + morning;
    }   
    
    static getConfiguration(){

    }

    static dateToDbString(date: Date){
        return date.getFullYear() + "-" + 
            (date.getMonth().toString().length < 2 ? "0" : "") + date.getMonth() + "-" + 
            (date.getDay().toString().length < 2 ? "0" : "") + date.getDay() + " " + 
            (date.getHours().toString().length < 2 ? "0" : "") + date.getHours() + ":" + 
            (date.getMinutes().toString().length < 2 ? "0" : "") + date.getMinutes() + ":" + 
            (date.getSeconds().toString().length < 2 ? "0" : "") + date.getSeconds();
    }

    static isoDateToDbString(date: string){
        return date.substring(0, 19).replace("T", " ");
    }
}