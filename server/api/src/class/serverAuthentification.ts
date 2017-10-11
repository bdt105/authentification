import express = require('express');
import { Connexion } from "./connexion";
import { Toolbox } from "./toolbox";

export class ServerAuthentification {
    private app: any;

    constructor(app: any){
        this.app = app;
    }

    private errorMessage(text: string){
        return {"status": "ERR", "message": text};
    }

    public assign(){
        Toolbox.log("Authentification ==> API launched");
        
        this.app.get('/', function (request: any, response: any) {
            response.send('API Authentification is running');
        });
        let multer = require('multer');
        let upload = multer();
        
        
        this.app.post('/get', upload.array(), (request: any, response: any) => {
            let login = request.body.login;
            let password = request.body.password;
        
            let connexion = new Connexion();
        
            let callback = (err: any, data: any) => {
                if (err){
                    Toolbox.log("/get");
                    Toolbox.log(err);
                    response.status(404);
                    response.send(JSON.stringify(this.errorMessage(err)));
                }else{
                    var jwt = require('jsonwebtoken');
                    let ret = connexion.checkJwt(data);
                    response.status(200);
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(ret));
                }
            }
        
            connexion.getJwt(callback, login, password);
        });
        
        this.app.post('/check', upload.array(), (request: any, response: any) => {
            let token = request.body.token;
            let jwt = require('jsonwebtoken');
            let connexion = new Connexion();
            let ret = connexion.checkJwt(token);
            response.setHeader('content-type', 'application/json');
            response.status(ret.token ? 200 : 404);
            response.send(JSON.stringify(ret));
            Toolbox.log("/check");
            Toolbox.log(JSON.stringify(ret));
        });
        
        this.app.post('/encrypt', upload.array(), (request: any, response: any) => {
//            let token = request.body.token;
            let text = request.body.text;

            let connexion = new Connexion();
            let encrypt = connexion.encrypt(text);
            let ret = {"encrypted": encrypt};

            response.status(200);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(ret));
            
            Toolbox.log("/crypt");
            Toolbox.log(JSON.stringify(ret));
        });
        
        this.app.get('/check/:token', upload.array(), (request: any, response: any) => {
            let token = request.params.token;
            let jwt = require('jsonwebtoken');
            let connexion = new Connexion();
            let ret = connexion.checkJwt(token);
            response.status(ret.token ? 200 : 404);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(ret));
        });
        
    }

    
}    