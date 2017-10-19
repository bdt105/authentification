import { DatabaseTable } from 'bdt105databaseapi/dist/databaseObject';
import { Connexion } from "bdt105connexion/dist";
import { QueryAttribute, TableApi, RecordsetApi } from "bdt105databaseapi/dist";

export class ApiUser extends TableApi {

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

            if (!usr){
                response.send(this.errorMessage('Please define a user'))
            }

            let queryAttributes = new QueryAttribute();
            queryAttributes.from = "user";
            queryAttributes.select = "*";
                
            let table = new DatabaseTable(this.connexion, queryAttributes);
            
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

            if (!login){
                response.send(this.errorMessage('Please define a login'))
            }            
        
            let queryAttributes = new QueryAttribute();
            queryAttributes.from = "user";
            queryAttributes.select = "*";
            let table = new DatabaseTable(this.connexion, queryAttributes);
            
            table.loadFromWhere(callback, "login='" + login + "'");
        });
    }
    
}    