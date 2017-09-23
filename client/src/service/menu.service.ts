import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestMethod, Headers } from '@angular/http';
import { ToolboxService } from '../service/toolbox.service';

@Injectable()
export class MenuService {
    menu: any[];

    constructor(private http: Http, private toolboxService: ToolboxService){
        
    }

    public load (url: string, callbackSuccess?: Function, callbackFailure?: Function){
        this.toolboxService.log(url);
        this.http.get(url).subscribe(
            (data: any) => this.manageData(callbackSuccess, data),
            (error: any) => this.manageError(callbackFailure, error)
        );
    }

    private manageData (callback: any, data: any){
        this.toolboxService.log(data);
        this.menu = this.toolboxService.parseJson(data._body);
        if (callback){
            callback(this.menu);
        }
    };

    private manageError (callback: any, error: any){
        console.log(error);
        if (callback){
            callback(error);
        }
    };

}