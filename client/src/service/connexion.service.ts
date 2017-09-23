import { Injectable } from '@angular/core';
import { ToolboxService } from '../service/toolbox.service';
import { ConfigurationService } from '../service/configuration.service';
import { RestService } from '../service/rest.service';

@Injectable()
export class ConnexionService {
    private __connexion: any;
    private configuration: any;
    private tableName = "user";
    private localStorageName = "connexion";
    private statusOk = "OK";

    private redirectUrl: string;

    constructor(private toolboxService: ToolboxService, private restService: RestService, private configurationService: ConfigurationService){
    }
    
    disconnect (){
        this.toolboxService.removeFromStorage(this.localStorageName)
        this.__connexion = null;
        return true;
    };
    
    get connexion (){
        var conn = this.toolboxService.readFromStorage(this.localStorageName);
        if (typeof conn == "object"){
            this.__connexion = conn;
            return this.__connexion;
        } else {
            return null;
        }
    };

    get connected (){
        var conn = this.toolboxService.readFromStorage(this.localStorageName);
        if (typeof conn == "object"){
            return conn.status === this.statusOk;
        }
        
        return false;
    };

    get currentUser(){
        var conn = this.toolboxService.readFromStorage(this.localStorageName);
        if (typeof conn == "object"){
            return conn.decoded;
        }
        
        return null;
    }

    connect (customCallBackSuccess: Function, customCallBackFailure: Function, login: string, password: string, rememberMe: boolean){
        let url = this.configurationService.configuration.authentificationApi.baseUrl;
        url += this.configurationService.configuration.authentificationApi.get;
        let body = {"login": login, "password": password};
        this.restService.callPost(
            (data: any) => this.success(customCallBackSuccess, customCallBackFailure, rememberMe, data),
            (data: any) => this.failure(customCallBackFailure, rememberMe, data), 
            url, body);
    };

	changeCurrentUserLang (lang: string){
		if (this.__connexion && this.__connexion.decoded){
			this.__connexion.decoded.lang = lang;
			this.toolboxService.writeToStorage(this.localStorageName, this.__connexion, false);
		}
	}    

    private success (customCallBackSuccess: Function, customCallBackFailure: Function, rememberMe: boolean, data: any){
        this.__connexion = data.json;
        if (this.__connexion.token){
            this.toolboxService.writeToStorage(this.localStorageName, this.__connexion, rememberMe)
            if (customCallBackSuccess !== null){
                customCallBackSuccess(this.__connexion);
            }
        }else{
            if (customCallBackFailure !== null){
                customCallBackFailure(this.__connexion);
            }
        }

    };

    private failure (customCallBackFailure: Function, rememberMe: boolean, data: any){
        this.__connexion = null;
        this.toolboxService.removeFromStorage(this.localStorageName);
        if (customCallBackFailure !== null){
            customCallBackFailure(data);
        }
    };
}