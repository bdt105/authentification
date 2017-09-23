import express = require('express');
import { Connexion } from "./connexion";
import { ApiObject } from "./apiObject";
import { Toolbox } from "./toolbox";

export class ServerObject {
    protected app: any;
    protected tableName: string;
    protected idFieldName: string;
    protected fields: any;

    constructor(app: any){
        this.app = app;
    }

    protected errorMessage(text: string){
        return {"status": "ERR", "message": text};
    }

    assign(tableName: string, idFieldName: string, fields: any = null){
        this.assignObject(tableName, idFieldName, fields);
    }

    protected assignObject(tableName: string, idFieldName: string, fields: any = null){
        Toolbox.log(tableName + " ==> API launched");
        
        this.app.get('/', function (request: any, response: any) {
            response.send('API Authentification is running');
        });
        let multer = require('multer');
        let upload = multer();
        
        this.app.post('/' + tableName + 's', upload.array(), (request: any, response: any) => {
            let token = request.body.token;
            let where = request.body.filter;
            let limit = request.body.limit;
            let offset = request.body.offset;
            
            let callback = function(err: any, data: any){
                if (err){
                    response.send(JSON.stringify(err));
                }else{
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            }

            let table = new ApiObject(token, tableName, idFieldName, fields);
        
            table.loadFromWhere(callback, where, limit, offset);
        });
        
        this.app.put('/' + tableName, upload.array(), (request: any, response: any) => {
            let token = request.body.token;
            let usr = request.body.user;
            
            let callback = (err: any, data: any) => {
                if (err){
                    response.send(JSON.stringify(this.errorMessage(err)));
                }else{
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            }
        
            let table = new ApiObject(token, tableName, idFieldName, fields);
            
            table.save(callback, usr);
        });
        
        this.app.post('/' + tableName + '/fresh', upload.array(), (request: any, response: any) => {
            let token = request.body.token;
            
            let callback = (err: any, data: any) => {
                if (err){
                    response.send(JSON.stringify(this.errorMessage(err)));
                }else{
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            }
        
            let table = new ApiObject(token, tableName, idFieldName, fields);
            
            table.fresh(callback);
        });
        
        this.app.delete('/' + tableName, upload.array(), (request: any, response: any) => {
            let token = request.body.token;
            let id = request.body.id;
            
            let callback = (err: any, data: any) => {
                if (err){
                    response.send(JSON.stringify(this.errorMessage(err)));
                }else{
                    response.setHeader('content-type', 'application/json');
                    response.send(JSON.stringify(data));
                }
            }
        
            let table = new ApiObject(token, tableName, idFieldName, fields);
            
            table.deleteFromId(callback, id);
        });      
    }
}    