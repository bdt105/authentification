import { location } from 'ngx-bootstrap/utils/facade/browser';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TranslateService } from '../../service/translate.service';
import { ConnexionService } from '../../service/connexion.service';
import { RestService } from '../../service/rest.service';
import { ConfigurationService } from '../../service/configuration.service';

import { TranslateComponent } from '../../component/translate/translate.component';
import { GenericComponent } from '../../component/generic.component';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [TranslateService]
})

export class UsersComponent implements GenericComponent{
    private connexion: any;
    private detailUrl: string = "/user";
    data: any;
    err: any;
    configuration: any;

    loadingDone = true;

    constructor(private translateService: TranslateService, private connexionService: ConnexionService, private router: Router, 
        private activatedRoute: ActivatedRoute, private restService: RestService, private configurationService: ConfigurationService) {}

    ngOnInit(){
        this.activatedRoute.queryParams.subscribe(params => {});
        this.connexion = this.connexionService.connexion;
        this.configuration = this.configurationService.configuration.users;        
        this.load();
    }

    private successLoad(data: any){
        this.data = data.json;
        this.err = null;
    }

    private failureLoad(data: any){
        this.data = null;
        this.err = data;
    }

    load(){
        if (this.connexionService.connexion && this.connexionService.connected){
            let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.users;
            let body = {"token": this.connexionService.connexion.token}
            this.restService.callPost(
                (data: any) => this.successLoad(data),
                (err: any) => this.failureLoad(err), url, body);
        }
    }

    detail(item: any){
        let id = item[this.configuration.idFieldName];
        this.router.navigate([this.detailUrl, id]);
    }

    neww(){
        this.router.navigate([this.detailUrl, "__new"]);
    }

    deleteLogical(item: any){
        if (this.connexionService.connexion && this.connexionService.connected){
            let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.user;
            item.validated = 0;
            let body = {"token": this.connexionService.connexion.token, "user": item};
            this.restService.callPut(
                (data: any) => this.successLoad(data),
                (err: any) => this.failureLoad(err), url, body);
        }
    }

}