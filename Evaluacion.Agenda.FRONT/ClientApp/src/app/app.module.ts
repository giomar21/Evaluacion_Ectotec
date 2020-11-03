import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ListaContactosComponent } from './lista-contactos/lista-contactos.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {ConfirmDialogService} from './services/confirm-dialog.service'; 

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ListaContactosComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgbModalModule,
    RouterModule.forRoot([
      { path: '', component: ListaContactosComponent, pathMatch: 'full' },
      { path: 'lista-contactos', component: ListaContactosComponent },
    ])
  ],
  exports: [  
    ConfirmDialogComponent  
  ],  
  providers: [
    ConfirmDialogService  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
