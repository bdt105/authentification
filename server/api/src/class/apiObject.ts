import { Connexion } from "./connexion";
import { DatabaseObject, DatabaseRecordset, DatabaseTable, FieldValue } from './databaseObjects';

export class ApiObject {
    protected connexion: any;
    protected token: string;
    protected error: string;
    protected extra : string;
    protected select: string;

    protected tableName: string;
    protected idFieldName: string;
    protected orderby: string;

    protected fields: any;
  
    constructor (token: string, tableName: string, idFielName: string, fields: any = null){
        this.tableName = tableName;
        this.idFieldName = idFielName;
        this.fields = fields;
        this.connexion = new Connexion();
        this.token = token;
        let databaseObject = new DatabaseObject("");
        this.orderby = this.tableName + "." + this.idFieldName;
        this.select =  (fields ? databaseObject.fieldsToString(this.tableName, this.fields, false) : "*");
    }

    private callbackLoad(err: any, rows: any, callback: Function){
        if (rows){
            let ret = rows;
            callback(err, ret);
        }else{
            callback(err, rows);
        }
    }

    loadFromWhere(callback: Function, where: string, limit: number = null, offset: number = null){
        let objects = new DatabaseRecordset(this.token, 
            {"select": this.select, "from": this.tableName, "extra": this.extra, "where": where, "orderby": this.orderby, "limit": limit, "offset": offset});
        objects.load((err: any, rows: any) => this.callbackLoad(err, rows, callback));
    }

    loadFromId (callback: Function, id: number){
        if (id){
            this.loadFromWhere(callback, this.tableName + "." + this.idFieldName + "='" + id + "'");
        }else{
            this.error = "Id is mandatory";
            callback(this.error, null); 
        }
    }

    deleteFromId(callback: Function, id: number){
        if (id){
            let objects = new DatabaseTable(this.token, this.tableName, this.idFieldName);
            objects.deleteFromId((err: any, rows: any) => callback(err, rows, callback, id), id.toString());
        }else{
            this.error = "Id is mandatory";
            callback(this.error, null); 
        }        
    }

    save (callback: Function, body: any){
        let object = new DatabaseTable(this.token, this.tableName, this.idFieldName);
        object.save(callback, body, body[this.idFieldName] ? body[this.idFieldName].toString() : null);
    }

    newTemporary (callback: Function, body: any){
        let object = new DatabaseTable(this.token, this.tableName, this.idFieldName);
        object.save(callback, body, body[this.idFieldName] ? body[this.idFieldName].toString() : null);
    }

    fresh (callback: Function){
        let object = new DatabaseTable(this.token, this.tableName, this.idFieldName);
        object.fresh(callback);
    }
}