import { DESTRUCTION } from 'dns';
import express = require('express');
import { Connexion } from "./connexion";
import { Toolbox } from "./toolbox";
import { Configuration } from "./configuration";
import { ServerObject } from "./serverObject";
import { ApiObject } from "./apiObject";

export class ServerUser extends ServerObject {

    private adminToken: string;

    constructor(app: any){
        super(app);
        this.tableName = "user";
        this.idFieldName = "iduser";
        this.fields = null;
        this.adminToken = Configuration.get().authentification.adminToken;
    }

    assign(){
        this.assignObject ("user", "iduser");

        let multer = require('multer');
        let upload = multer();

        this.app.put("/user/signup", upload.array(), (request: any, response: any) => {
            let usr = request.body.user;
            usr.validated = 0;
            
            let callback = (err: any, data: any) => {
                if (err){
                    response.send(JSON.stringify(this.errorMessage(err)));
                }else{
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            }
        
            let table = new ApiObject(this.adminToken, this.tableName, this.idFieldName, this.fields);
            
            table.save(callback, usr);
        });

        this.app.post("/user/check", upload.array(), (request: any, response: any) => {
            let login = request.body.login;
            
            let callback = (err: any, data: any) => {
                if (err){
                    response.send(JSON.stringify(this.errorMessage(err)));
                }else{
                    response.setHeader('content-type', 'application/json');
                    if (data && data.length > 0){
                        response.send(JSON.stringify({"found": true}));
                    }else{
                        response.send(JSON.stringify({"found": false}));
                    }
                }
            }
        
            let table = new ApiObject(this.adminToken, this.tableName, this.idFieldName, this.fields);
            
            table.loadFromWhere(callback, "login='" + login + "'");
        });
    }
    
}    