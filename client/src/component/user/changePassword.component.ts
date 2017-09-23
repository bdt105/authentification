import { location } from 'ngx-bootstrap/utils/facade/browser';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';

import { TranslateService } from '../../service/translate.service';
import { ConnexionService } from '../../service/connexion.service';
import { RestService } from '../../service/rest.service';
import { ToolboxService } from '../../service/toolbox.service';
import { ConfigurationService } from '../../service/configuration.service';
import { ValidatorService } from '../../service/validator.service';

import { NotificationsService } from '../../../node_modules/angular2-notifications';

import { TranslateComponent } from '../../component/translate/translate.component';
import { GenericComponent } from '../../component/generic.component';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    providers: [TranslateService]
})

export class ChangePasswordComponent implements GenericComponent{
    protected connexion: any;
//    data : any;
    countries : any;
    err: any;
    configuration: any;
    id: number;
    types = [{"code": 0, "name": "User"}, {"code": 1, "name": "Administrator"}];
    listUrl: string = "/users";
    showToast: boolean = false;

    @Input() administrationMode: boolean = true;

    loadingDone = true;
    
    public form: any;

    constructor(protected translateService: TranslateService, protected connexionService: ConnexionService, protected router: Router, 
        protected toolboxService: ToolboxService, protected activatedRoute: ActivatedRoute, protected restService: RestService, 
        protected configurationService: ConfigurationService, protected notificationService: NotificationsService, private formBuilder: FormBuilder,
        private validatorService: ValidatorService) {
        }

    ngOnInit(){
        this.initForm();            
        this.activatedRoute.queryParams.subscribe(params => {
            let idd = this.activatedRoute.snapshot.params["id"];
            if (!isNaN(idd)){
                this.id = this.activatedRoute.snapshot.params["id"];
            }
        });
        this.connexion = this.connexionService.connexion;
        this.configuration = this.configurationService.configuration.user;  
    }

    private initForm(data: any = null){
        if (this.form){
            if (data){
                for (var name in this.form.controls){
                    this.form.controls[name].setValue(data[name]);
                }
            }
        }else{
            this.form = this.formBuilder.group({
                "password": ["", Validators.required],
                "confirmPassword": ["", Validators.compose([Validators.required, this.validatorService.matchingPasswords("password","confirmPassword")])]
            });
        }
    }

    private formToData(){
        let data:any = {};

        data.password = this.form.controls.password.value;
        data.confirmPassord = this.form.controls.confirmPassord.value;

        return data;
    }    

    protected successSave2(data: any, message: string){
        if (data && data._body && data._body.status == "ERR"){
            this.toolboxService.toastMessage(this.notificationService, "", "Not saved", false);            
            this.toolboxService.log(data);
        }else{
            this.toolboxService.toastMessage(this.notificationService, "", message);
        }
    }
    
    protected successSave1(data: any, user: any){
        user.password = data.json.encrypted;
        let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.user;
        let body = {"token": this.connexionService.connexion.token, "user": user}
        this.restService.callPut(
            (data: any) => this.successSave2(data, "User saved"),
            (err: any) => this.failure(err, "User not saved"), url, body);
    }

    protected failure(data: any, error: string){
        this.toolboxService.toastMessage(this.notificationService, "", error, false);
    }

    save (){
        if (this.connexionService.connexion && this.connexionService.connected){
            let user = this.formToData();
            let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.encrypt;
            let body = {"token": this.connexionService.connexion.token, "text": user.password}
            this.restService.callPost(
                (data: any) => this.successSave1(data, user),
                (err: any) => this.failure(err, "User not saved"), url, body);
        }
    }    

}