import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestMethod, Headers } from '@angular/http';
import { ToolboxService } from '../service/toolbox.service';
import { RestService } from '../service/rest.service';
import { ConfigurationService } from '../service/configuration.service';

@Injectable()
export class ReferentialService {
    private __userTypes = [{"code": 0, "name": "User"}, {"code": 1, "name": "Administrator"}];
    private __languages = [{"code": "FR", "name": "French"}, {"code": "EN", "name": "English"}];
    private __countries : any;

    constructor (private http: Http, private toolboxService: ToolboxService, private restService: RestService, private configurationService: ConfigurationService) {

    }

    get userTypes(){
        return this.__userTypes;        
    }

    get languages(){
        return this.__languages;        
    }

    private successCountries(callback: Function, data: any){
        this.__countries = data.json;
        if (callback){
            callback(this.__countries);
        }
    }

    private failureCountries(data: any){
        this.__countries = null;
    }

    getCountries(callback: Function){
        if (!this.__countries){
            let url2 = this.configurationService.configuration.countryApi.baseUrl + this.configurationService.configuration.countryApi.all;
            this.restService.callGet(
                (data: any) => this.successCountries(callback, data),
                (err: any) => this.failureCountries(err), url2, false);
        }else{
            if (callback){
                callback(this.__countries);
            }
        }
    }
}