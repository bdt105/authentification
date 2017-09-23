import { Injectable } from '@angular/core';
import { NotificationsService } from '../../node_modules/angular2-notifications';
import { Http, RequestOptions, RequestMethod, Headers } from '@angular/http';

declare var X2JS: any; // to avoid compilation problems
declare var vkbeautify: any; // to avoid compilation problems

@Injectable()
export class ToolboxService {

    constructor(private http: Http){}

    CSVtoArray (text: string) : string[] {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*(?:;\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^;'"\s\\]*(?:\s+[^;'"\s\\]+)*))\s*(?:;|$)/g;

        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a: string[] = [];                     // Initialize array to receive values.
        if (text){
        }
        return a;
    };

    arrayToCSV(array: string[]): string{
        var ret = "";
        for (var i = 0; i < array.length; i ++){
            ret += (ret == "" ? "" : ";") + array[i];
        }
        return ret;
    }

    Levenshtein (a: string, b: string): number {
        const an = a ? a.length : 0;
        const bn = b ? b.length : 0;
        if (an === 0) {
            return bn;
        }
        if (bn === 0) {
            return an;
        }
        const matrix = new Array<number[]>(bn + 1);
        for (let i = 0; i <= bn; ++i) {
            let row = matrix[i] = new Array<number>(an + 1);
            row[0] = i;
        }
        const firstRow = matrix[0]; 
        for (let j = 1; j <= an; ++j) {
            firstRow[j] = j;
        }
        for (let i = 1; i <= bn; ++i) {
            for (let j = 1; j <= an; ++j) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1], // substitution
                        matrix[i][j - 1], // insertion
                        matrix[i - 1][j] // deletion
                    ) + 1;
                }
            }
        }
        return matrix[bn][an];
    };

    download (content: string, filename: string) : void {
        var contentType = 'application/octet-stream';
        var a = document.createElement('a');
        var blob = new Blob([content], {'type':contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    xml2Json (text: string){
        var x2js = new X2JS();
        return x2js.xml_str2json(text);                
    };
        
    beautifyXml (text: string){
        if (text && text != null){
            return vkbeautify.xml(text);
        }else{
            return "";
        }          
    };

    beautifyJson (text: string){
        if (text && text != null){
            return vkbeautify.json(text);
        }else{
            return "";
        }          
    };

    parseJson(str: string) {
        var json: any;
        try {
            json = JSON.parse(str);
        } catch (e) {
            json = str;
        }
        return json;
    }

    writeToStorage (key: string, object: any, forever: boolean){
        var str: string;
        if (typeof object != "string"){
            str = JSON.stringify(object);
        }else{
            str = object;
        }
        if (forever){
            localStorage.setItem(key, str);
        }else{
            sessionStorage.setItem(key, str);
        }
    };

    readFromStorage (key: string){
        var res = sessionStorage.getItem(key);
        if (res == null){
            res = localStorage.getItem(key);
        }
        return this.parseJson(res);
    };

    removeFromStorage (key: string){
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    };

    log(thing: any){
        console.log(thing);
    }

    logRequest(user: string, url: string, body: any, result: any, hiddenUrl: string){
        var logs = this.readFromStorage("logs");
        if (!logs){
            logs = [];
        }
        var log = {"user": user, "date": Date.now(), "url": url, "body": JSON.stringify(body), "result": JSON.stringify(result)};
        logs.push(log);
        this.writeToStorage("logs", logs, true);
    }
    
    getLogRequest(user: string){
        var logs = this.readFromStorage("logs");
        return logs;
    }

    clearLogs(){
        this.removeFromStorage("logs");
    }

    arrayOfObjectsToString (array, fieldName, search, separator, prefix, suffix){
        var ret = "";
        if (array){
            for (var i = 0 ; i < array.length; i++){
                ret += (ret === "" ? "" : separator) + array[i][fieldName] + prefix + search + suffix;
            }
        }
        return ret;
    }; 

    urlParamsToObject(url){
        var params = {}
        var arr1 = url.split("?");
        if (arr1.length > 1){
            var arr2 = arr1[1].split("&");
            for (var i=0; i < arr2.length; i++){
                var arr3 = arr2[i].split("=");
                params[arr3[0]] = arr3[1];
            }
        }
        return params;
    } 

    urlBase(url){
        var arr1 = url.split("?");
        return arr1[0];
    } 

    searchValueInArrayOfObjects(search: string, array: any[]){
        var ret: any[] = [];
        for (var i = 0; i < array.length; i++){
            var obj = array[i];
            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j++){
                if (typeof obj[keys[j]] == "string"){
                    var k: string = obj[keys[j]] + "";
                    if (k.includes(search)){
                        ret.push(obj);
                    }
                }
            }
        }
        return ret;
    }

    filterArrayOfObjects(array: any[], key: string, value: string){
        return array.filter((row) => row[key] == value);
    }

    urlIsHtml (url: string){
        var t = url.split("?");
        if (t.length > 0){
            var base = t[0];
            if (base.endsWith(".html") || base.endsWith(".php") || base.endsWith(".htm")){
                return true;
            }
        }
        return false;
    };
    
    updateUrlParameter (url: string, param: string, paramVal: string){
        if (url && url.length > 0 && param && param.length > 0){
            var newAdditionalURL = "";
            var tempArray = url.split("?");
            var baseURL = tempArray[0];
            var additionalURL = tempArray[1];
            var temp = "";
            if (additionalURL) {
                tempArray = additionalURL.split("&");
                for (var i=0; i<tempArray.length; i++){
                    if (tempArray[i].split('=')[0] != param){
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    }
                }
            }

            var rows_txt = temp + "" + param + "=" + paramVal;
            return baseURL + "?" + newAdditionalURL + rows_txt;
        }else{
            return url;
        }
    };
    
    updateUrlParameters (url: string, params: any[]){
        if (url && url.length > 0 && params && params.length > 0){
            var tempArray = url.split("?");
            var tempUrl = tempArray[0];
            for (var i = 0; i < params.length; i++){
                var param = params[i];
                tempUrl = this.updateUrlParameter(tempUrl, param.key, param.value);
            }
            return tempUrl;
        }else{
            return url;
        }
    };
        
    getUrlParams (url: string){
        if (url && url.length > 0){
            var tempArray = url.split("?");
            var additionalURL = tempArray[1];
            var ret = [];
            if (additionalURL) {
                var tempArray = additionalURL.split("&");
                for (var i = 0; i < tempArray.length ; i++){
                    var temp = tempArray[i].split("=");
                    var key = temp[0];
                    var value = temp[1];
                    ret.push({"key": key, "value": value});
                }
            }
            return ret;
        }else{
            return undefined;
        }
    };
    
    deleteEmptyParams(url: string){
        var rawUrl = this.getUrlWithoutParameters(url);
        var params = this.getUrlParams(url);
        var paramUrl = "";
        if (params && params.length > 0){
            for (var i = 0; i < params.length; i++){
                paramUrl += (paramUrl != "" ? "&" : "") + (params[i].value && params[i].value != "" ? params[i].key + "=" + params[i].value : "");
            }
        }
        return rawUrl + "?" + paramUrl;
    }

    getUrlWithoutParameters(url){
        var tempArray = url.split("?");
        return tempArray[0];
    };

    getKeyValue(obj: any){
        var temp: any[] = [];

        if (typeof obj == "object"){
            for (var key of Object.keys(obj)) {
                temp.push({key: key, value: obj[key]});
            }
        }
        return temp;
    }

    deleteStringList (text: string, separator: string, textToDelete: string){
        var ret = "";
        if (textToDelete && textToDelete.length > 0){
            var arr = text.split(separator);
            for (var i = 0; i < arr.length; i++){
                if (arr[i] != textToDelete){
                    ret += (ret == "" ? "" : separator) + arr[i];
                }
            }
        }
        return ret;
    };

    pushArray(source: any[], destination: any[]){
        if (source && destination){
            for(var i=0; i < source.length; i++){
                destination.push(source[i]);
            }
        }
    }

    removeKeyFromArray (array: any[], key: string){
        for (var i = 0; i < array.length; i++) {
            if(array[i].key == key) {
                array.splice(i, 1);
                return true;
            }
        }
        return false;
    };    

    fillDocWithContent(doc: any, content: string){
        if (doc){
            doc.open();
            doc.write(content);
            doc.close();        
        }
    }

    toastMessageHtml(notificationsService: NotificationsService, htmlMessage: string){
        var option = {
                timeOut: 5000,
                showProgressBar: true,
                pauseOnHover: false,
                clickToClose: true,
                maxLength: 10000
            };
        notificationsService.html(htmlMessage, "bare",  option);
    }  

    toastMessage(notificationsService: NotificationsService, title: string, message: string, good: boolean = true, duration: Number = 2000){
        var option = {
                timeOut: duration,
                showProgressBar: true,
                pauseOnHover: false,
                clickToClose: true,
                maxLength: 1000
            };
        if (good){
            notificationsService.success(title, message, option);
        }else{
            notificationsService.alert(title, message, option);
        }
    }

    isValidDate(date: string){
        if (date){
            var timestamp = Date.parse(date)
            return isNaN(timestamp) == false;
        }
        return false;
    }

    dateDbToStringFr(date: string, separator = "-"){
        if (date){
            return date.substr(8, 2) + separator + date.substr(5, 2) + separator + date.substr(0, 4);
        }else{
            return null;
        }
    }

    dateToDbString(date: Date){
        return date.getFullYear() + "-" + 
            (date.getMonth().toString().length < 2 ? "0" : "") + date.getMonth() + "-" + 
            (date.getDay().toString().length < 2 ? "0" : "") + date.getDay() + " " + 
            (date.getHours().toString().length < 2 ? "0" : "") + date.getHours() + ":" + 
            (date.getMinutes().toString().length < 2 ? "0" : "") + date.getMinutes() + ":" + 
            (date.getSeconds().toString().length < 2 ? "0" : "") + date.getSeconds();
    }

    dateWithoutTime(date: string){
        return date.substr(0, 10);
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    diffDateInDays(date1: Date, date2: Date){
        let diffMilliSeconds = date2.getTime() - date1.getTime();
        return diffMilliSeconds / 1000 / 60 / 60 / 24;
    }

    cleanDateDb(date: string){
        return date.substr(0, 19).replace("T", " ");
    }
        
}