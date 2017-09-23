import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestMethod, Headers } from '@angular/http';
import { ToolboxService } from '../service/toolbox.service';

@Injectable()
export class RestService {
    constructor (private http: Http, private toolboxService: ToolboxService) {

    }

    private setHeaders (contentType: string = "application/json"): Headers{
        var headers = new Headers();
        headers.append("Content-Type", contentType);
        return headers;
    }

    private manageData (callback: any, data: any){
        this.toolboxService.log(data);
        if (data._body && (typeof data._body  == "string")){
            if ((<string>data._body).startsWith("<?xml version")){
                data.json = this.toolboxService.xml2Json(data._body);
            }else{
                data.json = this.toolboxService.parseJson(data._body);
            }
        }
        callback(data);
    };

    private manageError (callback: any, error: any){
        console.log(error);
        callback(error);
    };

    public callPost(callbackSuccess: Function, callbackFailure: Function, url: string, body: any, contentType: string = "application/json"){
        var headrs = this.setHeaders(contentType);
        this.toolboxService.log(url);
        this.toolboxService.log(body);
        this.http.post(url, body, {headers: headrs}).subscribe(
            (data) => this.manageData(callbackSuccess, data),
            (error) => this.manageError(callbackFailure, error)
        );
    }

    public callDelete(callbackSuccess: Function, callbackFailure: Function, url: string, bodyy: any, contentType: string = "application/json"){
        var headrs = this.setHeaders(contentType);
        this.toolboxService.log(url);
        this.toolboxService.log(bodyy);
        this.http.delete(url, {headers: headrs, body: bodyy}).subscribe(
            (data) => this.manageData(callbackSuccess, data),
            (error) => this.manageError(callbackFailure, error)
        );
    }

    public callPut(callbackSuccess: Function, callbackFailure: Function, url: string, body: any, contentType: string = "application/json"){
        var headrs = this.setHeaders(contentType);
        this.toolboxService.log(url);
        this.toolboxService.log(body);
        this.http.put(url, body, {headers: headrs}).subscribe(
            (data) => this.manageData(callbackSuccess, data),
            (error) => this.manageError(callbackFailure, error)
        );
    }

    public callGet(callbackSuccess: Function, callbackFailure: Function, url: string, headers = true){
        var headrs = this.setHeaders();
        this.toolboxService.log(url);
        this.http.get(url, headers ? {headers: headrs}: null).subscribe(
            (data) => this.manageData(callbackSuccess, data),
            (error) => this.manageError(callbackFailure, error)
        );
    }

}