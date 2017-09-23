import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';

import { TranslateService } from '../../service/translate.service';
import { ConnexionService } from '../../service/connexion.service';
import { RestService } from '../../service/rest.service';
import { ToolboxService } from '../../service/toolbox.service';
import { ConfigurationService } from '../../service/configuration.service';
import { ValidatorService } from '../../service/validator.service';
import { ReferentialService } from '../../service/referential.service';

import { NotificationsService } from '../../../node_modules/angular2-notifications';

import { TranslateComponent } from '../../component/translate/translate.component';
import { GenericComponent } from '../../component/generic.component';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    providers: [TranslateService]
})

export class UserComponent implements GenericComponent{
    protected connexion: any;
    protected currentUser: any;
    countries : any;
    types : any;
    languages : any;
    err: any;
    configuration: any;
    id: number;
    listUrl: string = "/users";
    showToast: boolean = false;
    user: any;

    @Input() administrationMode: boolean = true;

    loadingDone = true;

    constructor(private translateService: TranslateService, private connexionService: ConnexionService, private router: Router, 
        private toolboxService: ToolboxService, private activatedRoute: ActivatedRoute, private restService: RestService, 
        private configurationService: ConfigurationService, private notificationService: NotificationsService, private formBuilder: FormBuilder,
        private validatorService: ValidatorService, private referentialService: ReferentialService) {
    }

    public userForm: any;
    public passwordForm: any;

    ngOnInit(){
        this.initUserForm();            
        this.activatedRoute.queryParams.subscribe(params => {
            let idd = this.activatedRoute.snapshot.params["id"];
            if (isNaN(idd)){
                if (idd === "__new"){
                    this.referentialService.getCountries((data: any) => this.successCountries(data));
                    this.neww();
                }
            }else{
                this.id = this.activatedRoute.snapshot.params["id"];
                this.referentialService.getCountries((data: any) => this.successCountries(data));
                this.load();
            }
        });
        this.connexion = this.connexionService.connexion;
        this.currentUser = this.connexionService.currentUser;
        this.configuration = this.configurationService.configuration.user;
        this.types = this.referentialService.userTypes;
        this.languages = this.referentialService.languages;
    }

    translate(text: string){
        return this.translateService.translate(text);
    }    

    private successCountries(data: any){
        this.countries = data;
    }

    private initUserForm(data: any = null){
        if (this.userForm){
            if (data){
                for (var name in this.userForm.controls){
                    this.userForm.controls[name].setValue(data[name]);
                }
                this.userForm.controls["password"].setValue("");
            }
        }else{
            this.userForm = this.formBuilder.group({
                "login": [data ? data.login : "", Validators.required],
                "firstname": [data ? data.firstname : ""],
                "lastname": [data ? data.lastname : ""],
                "password": ["", this.validatorService.passwordValidator],
                "passwordConfirmation": ["", this.validatorService.passwordValidator],
                "email": [data ? data.email : "", Validators.compose([Validators.required, this.validatorService.emailValidator])],
                "country": [data ? data.country : "", Validators.required],
                "language": [data ? data.language : "", Validators.required],
                "type": [data ? data.type : "", Validators.required],
                "validated": [data ? data.validated : "", Validators.required]
            }, {validator: this.validatorService.matchingPasswords('password', 'passwordConfirmation')});
        }
    }

    private userFormToData(data: any){
        data.login = this.userForm.controls.login.value;
        data.firstname = this.userForm.controls.firstname.value;
        data.lastname = this.userForm.controls.lastname.value;
        data.email = this.userForm.controls.email.value;
        data.country = this.userForm.controls.country.value;
        data.password = this.userForm.controls.password.value;
        data.language = this.userForm.controls.language.value;
        data.type = this.userForm.controls.type.value;
        data.validated = this.userForm.controls.validated.value ? 1 : 0;
    }

    protected successLoad (data: any){
        this.user = data.json[0];
        this.initUserForm(this.user);
        this.err = null;
    }

    protected failureLoad(data: any){
        this.err = data;
    }

    load(){
        if (this.connexionService.connexion && this.connexionService.connected){
            if (isNaN(this.id)){

            }else{
                let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.users;
                let body = {"token": this.connexionService.connexion.token, "filter": this.configurationService.configuration.user.idFieldName + "='" + this.id + "'"}
                this.restService.callPost(
                    (data: any) => this.successLoad(data),
                    (err: any) => this.failureLoad(err), url, body);
            }
        }
    }

    protected successSave2(data: any, message: string){
        if (data && data.json && data.json.status == "ERR"){
            this.toolboxService.toastMessage(this.notificationService, "", "Not saved", false);            
            this.toolboxService.log(data);
        }else{
            this.toolboxService.toastMessage(this.notificationService, "", message);
            if (data.json && data.json.insertId){
                this.router.navigateByUrl("/user/" + data.json.insertId);
            }else{
                window.location.reload();                
            }
        }
    }
    
    protected failure(data: any, error: string){
        this.toolboxService.toastMessage(this.notificationService, "", error, false);
    }

    protected successDelete(data: any, message: string){
        this.router.navigate([this.listUrl]);
    }
    
    protected successSave1(data: any, user: any){
        let successMessage = "User saved";
        if (data){
            user.password = data.json.encrypted;
            successMessage = "User saved and password changed";
        }
        let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.user;
        let body = {"token": this.connexionService.connexion.token, "user": user}
        this.restService.callPut(
            (data: any) => this.successSave2(data, successMessage),
            (err: any) => this.failure(err, "User not saved"), url, body);
    }

    private prepareBeforeSave(){
        if (!this.user.iduser){
            delete this.user["iduser"];
            this.user.creationdate = this.toolboxService.dateToDbString(new Date());
        }else{
            this.user.creationdate = this.toolboxService.cleanDateDb(this.user.creationdate);
        }
        if (!this.user.password){
            delete this.user["password"];
        }
        if (!this.user.validated){
            this.user.validated = 0;
        }
        this.user.updatedate = this.toolboxService.dateToDbString(new Date());
    }

    saveUser (){
        if (this.connexionService.connexion && this.connexionService.connected){
            this.userFormToData(this.user);
            this.prepareBeforeSave();
            if (this.user.password){
                let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.encrypt;
                let body = {"token": this.connexionService.connexion.token, "text": this.user.password}
                this.restService.callPost(
                    (data: any) => this.successSave1(data, this.user),
                    (err: any) => this.failure(err, "User not saved"), url, body);
            }else{
                this.successSave1(null, this.user);
            }
        }
    }  

    savePassword (){
        if (this.connexionService.connexion && this.connexionService.connected){
            this.userFormToData(this.user);
            this.prepareBeforeSave();
            if (this.user.password){
                let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.encrypt;
                let body = {"token": this.connexionService.connexion.token, "text": this.user.password}
                this.restService.callPost(
                    (data: any) => this.successSave1(data, this.user),
                    (err: any) => this.failure(err, "User not saved"), url, body);
            }else{
                this.successSave1(null, this.user);
            }
        }
    }  

    delete (){
        if (this.connexionService.connexion && this.connexionService.connected){
            let user = this.userFormToData(this.user);
            let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.user;
            let body = {"token": this.connexionService.connexion.token, "id": user[this.configurationService.configuration.user.idFieldName]}
            this.restService.callDelete(
                (data: any) => this.successDelete(data, null),
                (err: any) => this.failure(err, "User not deleted"), url, body);
        }
    }

    protected successNeww (data: any){
        this.user = data.json[0];
        this.user.type = 0;
        this.user.creationdate = this.toolboxService.dateToDbString(new Date());
        this.initUserForm(this.user);
        this.err = null;
    }

    protected neww(){
        if (this.connexionService.connexion && this.connexionService.connected){
            let url = this.configurationService.configuration.authentificationApi.baseUrl + this.configurationService.configuration.authentificationApi.userFresh;
            let body = {"token": this.connexionService.connexion.token}
            this.restService.callPost(
                (data: any) => this.successNeww(data),
                (err: any) => this.failure(err, "User not created"), url, body);
        }
    }

}