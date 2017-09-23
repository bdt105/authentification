import { Injectable } from "@angular/core";

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ConnexionService } from "../service/connexion.service";
import { ToolboxService } from "../service/toolbox.service";

@Injectable()

export class AuthGuard implements CanActivate{
    constructor(private router: Router, private connexionService: ConnexionService, private toolboxService: ToolboxService){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let conn = this.connexionService.connexion;
        if (!conn || !conn.currentUser){
            this.toolboxService.writeToStorage("redirectUrl", state.url, true);
            let url = this.toolboxService.readFromStorage("redirectUrl");
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

}