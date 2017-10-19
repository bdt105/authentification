import express = require('express');
import { Connexion } from "bdt105connexion/dist";
import { MyToolbox } from "./myToolbox";

export class ServerAuthentification {
    private app: any;
    private connexion: Connexion;
    private myToolbox: MyToolbox;

    constructor(app: any, connexion: Connexion){
        this.app = app;
        this.connexion = connexion;
        this.myToolbox = new MyToolbox();
    }

    private errorMessage(text: string){
        return {"status": "ERR", "message": text};
    }

    public assign(){
        this.myToolbox.logg("Authentification ==> API launched");
        
        this.app.get('/', function (request: any, response: any) {
            response.send('API Authentification is running');
        });
        let multer = require('multer');
        let upload = multer();
        
        
        this.app.post('/get', upload.array(), (request: any, response: any) => {
            let login = request.body.login;
            let password = request.body.password;
        
            let callback = (err: any, data: any) => {
                if (err){
                    this.myToolbox.logg("/get");
                    this.myToolbox.logg(err);
                    response.status(404);
                    response.send(JSON.stringify(this.errorMessage(err)));
                }else{
                    var jwt = require('jsonwebtoken');
                    let ret = this.connexion.checkJwt(data);
                    response.status(200);
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(ret));
                }
            }
        
            this.connexion.getJwt(callback, login, password);
        });
        
        this.app.post('/check', upload.array(), (request: any, response: any) => {
            let token = request.body.token;
            let jwt = require('jsonwebtoken');
            let ret = this.connexion.checkJwt(token);
            response.setHeader('content-type', 'application/json');
            response.status(ret.token ? 200 : 404);
            response.send(JSON.stringify(ret));
            this.myToolbox.logg("/check");
            this.myToolbox.logg(JSON.stringify(ret));
        });
        
        this.app.post('/encrypt', upload.array(), (request: any, response: any) => {
//            let token = request.body.token;
            let text = request.body.text;

            let encrypt = this.connexion.encrypt(text);
            let ret = {"encrypted": encrypt};

            response.status(200);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(ret));
            
            this.myToolbox.logg("/crypt");
            this.myToolbox.logg(JSON.stringify(ret));
        });
        
        this.app.get('/check/:token', upload.array(), (request: any, response: any) => {
            let token = request.params.token;
            let jwt = require('jsonwebtoken');
            let ret = this.connexion.checkJwt(token);
            response.status(ret.token ? 200 : 404);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(ret));
        });
        
    }

    
}    