import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ContactosService } from '../services/contactos.service';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.css']
})
export class ListaContactosComponent implements OnInit {

  public listContactos: Contacto[];
  public totalContactos: number;
  public pageIndex:number = 0;
  public pageSize:number = 5;

  contacto:Contacto;
  constructor(http: HttpClient, private contactService:ContactosService, private modal:NgbModal) {
    this.resetContact();
  }

  ngOnInit() {
    this.getContacts(this.pageSize, this.pageIndex + 1);
  }

  resetContact(){
    this.contacto = {
      id:'00000000-0000-0000-0000-000000000000',
      nombre :'',
      apellidoPaterno : '',
      apellidoMaterno : '',
      direccion : '',
      email: '',
      telefono:'',
      fechaCreacion:'',
      activo:false
    };
  }

  getContacts(nRegistros:number, nPagina:number) {
    this.contactService.get(nRegistros, nPagina)
    .pipe(first())
    .subscribe(
      data => {
        this.listContactos = data.listContactos;
        this.totalContactos = data.totalGlobal;
        console.log("this.listContactos > ", this.listContactos);
        console.log("this.totalContactos > ", this.totalContactos);
      },
      error => {
        console.error("Error > ", error);
      });
  }

  AgregarContacto(){
    this.contactService.post(this.contacto)
    .pipe(first())
    .subscribe(
      data => {
        this.resetContact();
        console.log('Data > ', data);
        this.getContacts(this.pageSize, this.pageIndex + 1);
      },
      error => {
        console.error("Error > ", error);
      }
    );  
  }

}
