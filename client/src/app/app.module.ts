import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

// Sidebar module
import { SidebarModule } from '../../node_modules/ng-sidebar';

// Bootstrap components
import { AccordionModule } from '../../node_modules/ngx-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Notifications https://jaspero.co/resources
import { SimpleNotificationsModule } from '../../node_modules/angular2-notifications';

// Confirmations https://mattlewis92.github.io/angular-confirmation-popover/
import { ConfirmationPopoverModule } from '../../node_modules/angular-confirmation-popover';

// Datatable component https://github.com/mariuszfoltak/angular2-datatable
import { DataTableModule } from "../../node_modules/angular2-datatable";

// Components
import { LoginComponent } from '../component/login/login.component';
import { TranslateComponent } from '../component/translate/translate.component';
import { ItemsComponent } from '../component/item/items.component';
import { ItemComponent } from '../component/item/item.component';
import { TinymceComponent } from '../component/item/tinyMce.component';
import { UsersComponent } from '../component/user/users.component';
import { UserComponent } from '../component/user/user.component';

// Providers
import { ConnexionService } from '../service/connexion.service';
import { ConfigurationService } from '../service/configuration.service';
import { MenuService } from '../service/menu.service';
import { ToolboxService } from '../service/toolbox.service';
import { RestService } from '../service/rest.service';
import { TranslateService } from '../service/translate.service';
import { ValidatorService } from '../service/validator.service';
import { ReferentialService } from '../service/referential.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TranslateComponent,
    ItemsComponent,
    ItemComponent,
    TinymceComponent,
    UsersComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    DataTableModule,
    SidebarModule.forRoot(),
    AccordionModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
        confirmButtonType: 'danger' // set defaults here
    })        
  ],
  providers: [ConnexionService, ConfigurationService, MenuService, ToolboxService, TranslateService, RestService, ValidatorService, ReferentialService],
  bootstrap: [AppComponent]
})

export class AppModule { }
