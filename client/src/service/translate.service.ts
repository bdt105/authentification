import { Injectable } from '@angular/core';
import { ConnexionService } from '../service/connexion.service';
import { ToolboxService } from '../service/toolbox.service';

@Injectable()
export class TranslateService {
    private translation: any[];
    private connexion: any;
    private fileName = "./assets/translation.json";
    private localStorageName = "translation";

    constructor(private connexionService: ConnexionService, private toolboxService: ToolboxService){
        this.connexion = connexionService.connexion;
    }

    private findTranslation(text: string, language: string){
        if (this.translation){
            for (var i = 0; i < this.translation.length; i++){
                if (this.translation[i].label == text && this.translation[i].translations){
                    for (let j=0; j < this.translation[i].translations.length; j++){
                        if (this.translation[i].translations[j].language == language){
                            return this.translation[i].translations[j].translation;
                        }
                    }
                }
            }
        }    
        return text;    
    }

    public translate(text: string): string{
        this.translation = this.toolboxService.readFromStorage(this.localStorageName);
        if (!this.translation){
            this.load();
        }
        let language = this.connexion && this.connexion.decoded && this.connexion.decoded.lang ? this.connexion.decoded.lang : "";
        return this.findTranslation(text, language);
    }

    public t(text: string){
        return this.translate(text);
    }

    private load(){
        this.translation = this.toolboxService.readFromStorage(this.localStorageName);

        if (!this.translation && this.connexion && this.connexion.decoded && this.connexion.decoded.lang){
            let request = new XMLHttpRequest();
            request.open('GET', this.fileName, false);  // `false` makes the request synchronous
            request.send(null);
            
            if (request.status === 200) {
                this.translation = JSON.parse(request.responseText);
                this.toolboxService.writeToStorage(this.localStorageName, this.translation, true);
            }
        }
        return this.translation;
    }

    refresh(){
        this.load();
    }
    
}