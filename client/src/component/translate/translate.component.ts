import { Component, Input, OnInit } from '@angular/core';

import { GenericComponent } from '../../component/generic.component';
import { TranslateService } from '../../service/translate.service';

@Component({
  	selector: 'translate',
  	template: '{{translation}}',
    providers: [TranslateService]
})

export class TranslateComponent implements GenericComponent {
    @Input() text: string;
    @Input() isTag = false;

    translation: string;

    constructor(private translateService: TranslateService){}

	ngOnInit(): void {
        this.translation = this.translateService.translate(this.text);
  	}

}