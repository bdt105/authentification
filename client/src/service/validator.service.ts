import { Injectable } from '@angular/core';
import { ConnexionService } from '../service/connexion.service';
import { ToolboxService } from '../service/toolbox.service';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';

@Injectable()
export class ValidatorService {
    emailValidator (control: FormControl): {[key: string]: any} {
        var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (control.value && !emailRegexp.test(control.value)) {
            return { invalidEmail: true };
        }
    }
      
    passwordValidator (control: FormControl): {[key: string]: any} {
        if (control.value){
            if (control.value.length < 4) {
                return { invalidPassword: true };
            }
        }
    }
      
    matchingPasswords (passwordKey: string, confirmPasswordKey: string, active: boolean = true) {
        return (group: FormGroup): {[key: string]: any} => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];
          
            if (active && password && confirmPassword && (password.value || confirmPassword.value)){
                if (password.value !== confirmPassword.value) {
                    return { mismatchedPasswords: true };
                }
            }
        }
    }
}