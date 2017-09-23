import { decode } from 'punycode';
import { Configuration } from "./configuration";
import { Toolbox } from "./toolbox";

export class Connexion {
    private mySql: any;
    private sqlConnexion: any;
    private jsonwebtoken: any;
    private jwtStatusOk = "OK";
    private jwtStatusERR = "ERR";

    public rows: any;
    public err: any;
    public iss: string;
    public permissions: string;
    public jwtSecretKey: string;
    public epirationDate: number;

    constructor (jwtSecretKey: string = null){
        this.jwtSecretKey = jwtSecretKey;
        if (!this.jwtSecretKey){
            this.jwtSecretKey = Configuration.get().authentification.secret;
        }
        this.mySql = require('mysql');
        this.jsonwebtoken = require('jsonwebtoken');
    }

    private connectSql(){
        this.sqlConnexion = this.mySql.createConnection({
            "host": Configuration.get().mySql.host,
            "user": Configuration.get().mySql.user,
            "port": Configuration.get().mySql.port,
            "password": Configuration.get().mySql.password,
            "database": Configuration.get().mySql.database
        });
        if (this.sqlConnexion){
            let err = this.sqlConnexion.connect(
                (err: any) => this.callbackConnect(err)
            );
        }
    }

    private releaseSql(){
        if (this.sqlConnexion){
            Toolbox.log('Connexion to the database as id ' + this.sqlConnexion.threadId + ' ended !');
            this.sqlConnexion.end();
            this.sqlConnexion = null;
        }
    }

    private callbackConnect(err: any){
        this.err = err;        
        if (err) { 
            console.error('error connecting: ' + err.stack); 
            this.releaseSql();        
            return; 
        } 
        Toolbox.log('Connected to the database as id ' + this.sqlConnexion.threadId);
    }

    private callbackGetJwt(callback: Function, err: any, rows: any, plainPassword: string){
        this.rows = rows;
        this.err = err;
        let user: any = {};
        let jwt = null;
        this.releaseSql();
        if (rows && rows.length > 0){
            let encryptedPassword = this.encrypt(plainPassword);
            user = rows[0];
            if (encryptedPassword === user.password){
                user.password = null;
                jwt = this.jsonwebtoken.sign(user, this.jwtSecretKey);    
                callback(err, jwt);
            }else{
                callback("Wrong password or login", jwt);
            }
        }else{
            if (callback){
                callback(err, jwt);
            }
        }
    }

    private callbackQuerySql(callback: Function, err: any, rows: any){
        this.releaseSql();

        if (callback){
            callback(err, rows);
        }
    }

    querySql(callback: Function, sql: string, token: string){
        this.connectSql();
        if (token && this.isTokenValid(token)){
            this.sqlConnexion.query(sql, 
                (err: any, rows: any) => this.callbackQuerySql(callback, err, rows));
        }else{
            callback({"err": "invalid token"}, undefined);
        }
    }

    getJwt(callback: Function, login: string, plainPassword: string){
        this.connectSql();
        if (this.sqlConnexion){
            let sql = "select * from user where validated = 1 and login = '" + login + "'";
            this.sqlConnexion.query(sql, 
                (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, plainPassword));
        }
    }

    checkJwt(token: string){
        var jwt = require('jsonwebtoken');
        try {
            var decoded = jwt.verify(token, this.jwtSecretKey);
            if (decoded.iduser){
                Toolbox.log("User Id: " + decoded.iduser + ", login: " + decoded.login);
            }
            return {"token":token, "status": this.jwtStatusOk, "decoded": decoded};
        } catch(err) {
            return {"token":token, "status": this.jwtStatusERR, "decoded": null};
        }        
    }

    isTokenValid(token: string) : boolean{
        let jwt = this.checkJwt(token);
        if (jwt){
            return jwt.status == this.jwtStatusOk;
        }else{
            return false;
        }
    }

    encrypt(plain: string){
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, Configuration.get().authentification.salt);        
        return hash;
    }

    compareEncrypt(encrypted: string, plain: string){
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, Configuration.get().authentification.salt);        
        return hash === encrypted;
    }

    tryConnectSql(){
        this.connectSql();
    }
    
}