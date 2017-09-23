import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';

import { TranslateService } from '../../service/translate.service';
import { ConnexionService } from '../../service/connexion.service';
import { ValidatorService } from '../../service/validator.service';

import { GenericComponent } from '../../component/generic.component';
import { TranslateComponent } from '../../component/translate/translate.component';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [TranslateService]
})

export class LoginComponent implements GenericComponent{
    message: string;
    error: string;
    connexion: any;
    loadingDone = true;

    @Input() newSubscription: boolean = false;

    private forwardUrl: string;
    
    @Output() connected: EventEmitter<any> = new EventEmitter<any>();
    @Output() disconnected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translateService: TranslateService, private connexionService: ConnexionService, private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: FormBuilder, private validatorService: ValidatorService) {
    }

    public form = this.formBuilder.group({
        "login": ["", Validators.required],
        "password": ["", Validators.required],
        "passwordConfirm": [""],
        "rememberMe": [""]
    }, {validator: this.newSubscription ? this.validatorService.matchingPasswords('password', 'passwordConfirm'): null});
    
    ngOnInit(){
        this.activatedRoute.queryParams.subscribe(params => {
            this.forwardUrl = params['url'];
        });
        this.connexion = this.connexionService.connexion;     
    }

    translate(text: string){
        return this.translateService.translate(text);
    }

    connect(){
        if (this.form.valid){
            this.loadingDone = false;
            this.connexionService.connect(
                (data: any) => this.connexionSuccess(data), 
                (data: any) => this.connexionFailure(data),
                this.form.controls.login.value, this.form.controls.password.value, this.form.controls.rememberMe.value);
        }else{
            this.error = this.translate("Input error");
        }
    }

    neww(){ 
        this.newSubscription = true;
    }

    private connexionSuccess(connexion: any){
        this.loadingDone = true;
        this.message = this.translateService.translate("Connexion succeded");
        this.error = null;
        this.connexion = this.connexionService.connexion;
        this.connected.emit(this.connexion);
        if (this.forwardUrl){
            window.location.href = this.forwardUrl;            
        }
    }

    private connexionFailure = function (data: any){
        this.loadingDone = true;
        this.error = data.hasOwnProperty("token") && !data.token ? this.translateService.translate("Connexion impossible! Please double check your connection data!") : this.translateService.translate("Connexion impossible! There is something wrong, server is unreachable !");
        this.connexion = null;
        this.disconnected.emit(null);
    }

    disconnect(){
        this.connexionService.disconnect();
        this.connexion = null;
        this.disconnected.emit(null);
    }

}