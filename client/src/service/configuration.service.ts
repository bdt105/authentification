import { Injectable } from '@angular/core';
import { ToolboxService } from '../service/toolbox.service';

@Injectable()
export class ConfigurationService {
    private __configuration: any;
    private fileName = "./assets/configuration.json";
    private localStorageName = "configuration";

    constructor(private toolboxService: ToolboxService){}

    get configuration(): any{
        this.__configuration = this.toolboxService.readFromStorage(this.localStorageName);

        if (!this.__configuration){
            var request = new XMLHttpRequest();
            request.open('GET', this.fileName, false);  // `false` makes the request synchronous
            request.send(null);
            
            if (request.status === 200) {
                this.__configuration = JSON.parse(request.responseText);
                this.toolboxService.writeToStorage(this.localStorageName, this.__configuration, true);
            }
        }
        return this.__configuration;
    }
    
}