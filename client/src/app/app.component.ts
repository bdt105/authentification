import { Component } from '@angular/core';

import { GenericComponent } from '../component/generic.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements GenericComponent {
	ngOnInit(): void {
	}    
}
