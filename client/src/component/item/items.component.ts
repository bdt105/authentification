import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GenericComponent } from '../../component/generic.component';
import { ToolboxService } from '../../service/toolbox.service';
import { ConnexionService } from '../../service/connexion.service';
import { TranslateService } from '../../service/translate.service';
import { NotificationsService } from '../../../node_modules/angular2-notifications';

import { TranslateComponent } from '../../component/translate/translate.component';

@Component({
    selector: 'items',
    templateUrl: './items.component.html',
    providers: [ToolboxService, ConnexionService, TranslateService]
})

export class ItemsComponent implements GenericComponent  {

    private connexion: any;

    public error: string;
    public filters: any;
    public showFilters = false;

    @Input() columns: any;
    @Input() data: any;
    @Input() originalData: any;
    
    @Output() detailClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() deleteClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() newClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() duplicateClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(private toolboxService: ToolboxService, private connexionService: ConnexionService, private translateService: TranslateService, 
        private router: Router, private activatedRoute: ActivatedRoute, private notificationsService: NotificationsService){
     }

    ngOnInit (){
        this.init();
    };

    translate(text: string){
        return this.translateService.translate(text);
    }

    init(){
        this.connexion = this.connexionService.connexion;
        this.filters = {};
    }

    detail(item: any){
        this.detailClick.emit(item);
    }

    save(item: any, gotToDetail = false){
        item.__gotToDetail = gotToDetail;
        this.saveClick.emit(item);
    }

    neww(){
        this.newClick.emit();
    }

    delete(item: any){
        this.deleteClick.emit(item);
    }

    filter(column: any){
        if (!this.originalData){
            this.originalData = Object.assign([], this.data);
        }
        var data = Object.assign([], this.data);
        var value = this.filters[column.fieldName];
        if (value){
            this.data = data.filter(function(item) {
                return item[column.fieldName] ? item[column.fieldName].includes(value) : false;
            });         
        }else{
            this.data = this.originalData;
        }
    }

    duplicate(item: any){
        this.duplicateClick.emit(item);
    }
}