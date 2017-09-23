import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { GenericComponent } from '../../component/generic.component';
import { TranslateService } from '../../service/translate.service';
import { TranslateComponent } from '../../component/translate/translate.component';

@Component({
    selector: 'item',
    templateUrl: './item.component.html',
    providers: [TranslateService]
})

export class ItemComponent implements GenericComponent {

    public item: any;
    private configuration: any;
    public changed = false;
    @Input() columns: any[];
    @Input() data: any;

    @Output() deleteClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() newClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() duplicateClick: EventEmitter<any> = new EventEmitter<any>();

    constructor (private translateService: TranslateService){}

    ngOnInit (){}

    translate(text: string){
        return this.translateService.translate(text);
    }

    save(){
        this.saveClick.emit(this.data);
    }

    neww(){
        this.newClick.emit(this.data);
    }

    duplicate(){
        this.duplicateClick.emit(this.data);
    }

    delete(){
        this.deleteClick.emit(this.data);
    }
}