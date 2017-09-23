import { isObject } from 'util';
import { Connexion } from "./connexion";
import { Toolbox } from "./toolbox";

export class FieldValue{
    public fieldName: string;
    public value: string;
    public comparisonOperator: string;
    public logicOperator: string;
}

export class DatabaseObject {
    protected connexion: any;
    protected token: string;
    
    constructor(token: string){
        this.connexion = new Connexion();
        this.token = token;
    }

    protected query(callback: Function, sql: string){
        if (this.connexion){
            Toolbox.log(sql);
            this.connexion.querySql(
                (err: any, rows: any) => callback(err, rows), sql, this.token);
        }
    } 
    
    protected getWhereString(fieldValues: FieldValue[], defaultLogicoperator = "AND", defaultComparisonOperator = "="): string{
        var ret = "";
        if (fieldValues){
            for (var i = 0; i < fieldValues.length; i ++){
                ret += (ret != "" ? (fieldValues[i].logicOperator ? " " + fieldValues[i].logicOperator + " " : " AND ") : "") + 
                    fieldValues[i].fieldName + (fieldValues[i].comparisonOperator ? fieldValues[i].comparisonOperator : "=") + "'" + fieldValues[i].value + "'";
            }
        }
        return ret;
    }
    
    fieldsToString(tableName: string, fields: any[], alias = true){
        var ret = "";
        for (var i = 0; i < fields.length; i++){
            ret += (ret == "" ? "" : ", ") + (alias ? tableName + "." : "") + fields[i] + (alias ? " " + tableName + "_" + fields[i]: "");
        }
        return ret;
    }

}

export class DatabaseRecordset extends DatabaseObject {
    protected attributes: any;

    constructor(token: string, attributes: any){
        super(token);
        this.attributes = attributes;
    }

    protected getSqlend(){
        let sqlEnd = (this.attributes.where ? " WHERE " + this.attributes.where : '') + 
        (this.attributes.groupby ? " GROUP BY " + this.attributes.groupby : "") +
        (this.attributes.orderby ? " ORDER BY " + this.attributes.orderby : "") + 
        (this.attributes.limit ? " LIMIT " + this.attributes.limit : "") + 
        (this.attributes.offset ? " OFFSET " + this.attributes.offset : "");
        return sqlEnd;
    }    

    protected getSql(){
        return "SELECT " + this.attributes.select + " FROM " + this.attributes.from + (this.attributes.extra ? " " + this.attributes.extra : "") + this.getSqlend();
    }

    protected whereString(fieldValues: FieldValue[], defaultLogicoperator = "AND", defaultComparisonOperator = "="): string{
        var ret = "";
        if (fieldValues){
            for (var i = 0; i < fieldValues.length; i ++){
                ret += (ret != "" ? (fieldValues[i].logicOperator ? " " + fieldValues[i].logicOperator + " " : " AND ") : "") + 
                    fieldValues[i].fieldName + (fieldValues[i].comparisonOperator ? fieldValues[i].comparisonOperator : "=") + "'" + fieldValues[i].value + "'";
            }
        }
        return ret;
    }

    load (callback: Function){
        this.query((err: any, rows: any) => callback(err, rows), this.getSql());
    }

}

export class DatabaseTable extends DatabaseRecordset {
    protected tableName: any;
    protected idFieldName: any;
    
    constructor(token: string, tableName: string, idFieldName: string){
        super(token, {"select": "*", "from": tableName, "idFieldName": idFieldName});
        this.tableName = tableName;
        this.idFieldName = idFieldName;
    }

    private callbackSearch (err: any, rows: any, prefix: string, operator: string, q: string, callback: Function){
        let searchString = "";
        for (var i = 0 ; i < rows.length; i++){
            searchString += (searchString == "" ? "" : " " + operator + " ") + rows[i].Field + prefix.replace("[]", q);
        }
        if (callback){
            this.attributes.where = searchString;
            this.query((err: any, rows: any) => callback(err, rows), this.getSql());
        }
    }

    loadFromId(callback: Function, id: string){
        this.attributes.where = this.attributes.idFieldName + "='" + id + "'";
        this.query((err: any, rows: any) => callback(err, rows), this.getSql()); 
    }

    loadFromWhere(callback: Function, where: string){
        this.attributes.where = where;
        this.query((err: any, rows: any) => callback(err, rows), this.getSql()); 
    }

    search (callback: Function, q: string, prefix: string, suffix: string){
        if (q){
            this.query((err: any, rows: any) => this.callbackSearch(err, rows, prefix, suffix, q, callback), "SHOW FIELDS FROM " + this.attributes.from);
        }else{
            this.query((err: any, rows: any) => callback(err, rows), this.getSql());
        }
    }

    private insertString (body: any){
        let values = "";
        let fields = "";
        for (var name in body) {
            fields += (values == "" ? "" : ", ") + name;
            values += (values == "" ? "" : ", ") + (body[name] === null ? "null" : "'" + body[name] + "'");
        }

        return "(" + fields + ") " + " VALUES (" + values + ")";
    }

    insert (callback: Function, body: any){
        let sql = "INSERT INTO " + this.attributes.from + this.insertString(body);
        this.query((err: any, rows: any) => callback(err, rows), sql);
    }

    deleteFromField (callback: Function, fieldName: string, value: string){
        let where = fieldName + "='" + value + "'";
        this.deleteFromWhere((err: any, rows: any) => callback(err, rows), where);
    }

    deleteFromId (callback: Function, value: string){
        let where = this.attributes.idFieldName + "='" + value + "'";
        this.deleteFromWhere((err: any, rows: any) => callback(err, rows), where);
    }

    deleteFromWhere (callback: Function, where: string){
        let sql = "DELETE FROM " + this.attributes.from + " WHERE " + where;
        this.query((err: any, rows: any) => callback(err, rows), sql);
    }

    private updateString(body: any){
        let st = "";
        let update = false;
        
        for (var name in body) {
            st += (st == "" ? "" : ", ") + (body[name] === null ? name + "=null" : name + "='" + body[name] + "'");
        }

        return st;
    }

    update (callback: Function, body: any, where: string){
        let sql = "UPDATE " + this.attributes.from + " SET " + this.updateString(body) + " WHERE " + where;
        this.query((err: any, rows: any) => callback(err, rows), sql);
    }

    private callbackUnique(callback: Function, body: any, id: string, err: any, rows: any){
        if (rows && rows.length > 0){
            let where = this.attributes.idFieldName + "='" + id + "'";
            this.update(callback, body, where);
        }else{
            this.insert(callback, body);
        }
    }

    save (callback: Function, body: any, id: string){
        let where = this.attributes.idFieldName + "='" + id + "'";
        let sql = "SELECT * FROM " + this.attributes.from + " WHERE " + where;
        this.query((err: any, rows: any) => this.callbackUnique(callback, body, id, err, rows), sql);
    }

    private callbackFresh(err: any, rows: any, callback: Function){
        let body: any = {};
        if (rows){
            for (var i = 0 ; i < rows.length; i++){
                body[rows[i].Field] = "";
            }
        }
        if (callback){
            let arr = [];
            arr.push(body);
            callback(err, arr);
        }
    }

    fresh (callback: Function){
        let sql = "SHOW FIELDS FROM " + this.attributes.from;
        this.query((err: any, rows: any) => this.callbackFresh(err, rows, callback), sql);
    }
}