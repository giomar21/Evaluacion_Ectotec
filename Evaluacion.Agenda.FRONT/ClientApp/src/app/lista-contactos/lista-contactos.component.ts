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
  public msj:string;
  public result: OperationResult;

  contacto:Contacto;
  constructor(http: HttpClient, private contactService:ContactosService, private modal:NgbModal) {
    this.resetContact();
    this.resetResult();
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
      activo:false,
      operacion:'Crear'
    };
  }

  resetResult(){
    this.result = {
      success: false,
      message: ''
    }
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

  ProcesarContacto() {
    if (this.contacto.operacion == 'Crear')
    {
      this.contactService.post(this.contacto)
      .pipe(first())
      .subscribe(
        data => {
          this.result = data;
          if (data.success)
          {
            this.resetResult();
            this.resetContact();
            this.getContacts(this.pageSize, this.pageIndex + 1);
            this.modal.dismissAll();
          }    
        },
        error => {
          console.error("Error > ", error);
        }
      );    
    }
    else
    {
      this.contactService.put(this.contacto)
      .pipe(first())
      .subscribe(
        data => {
          this.result = data;
          if (data.success)
          {
            this.resetResult();
            this.resetContact();
            this.getContacts(this.pageSize, this.pageIndex + 1);
            this.modal.dismissAll();
          }     
        },
        error => {
          console.error("Error > ", error);
        }
      );    
    }  
  }

  Editar(contacto:Contacto, contactoModal) {
    this.contacto = contacto;
    this.contacto.operacion = 'Editar';
    this.modal.open(contactoModal);
    this.resetResult();
  }

  Crear(contactoModal) {
    this.contacto.operacion = 'Crear';
    this.modal.open(contactoModal);
    this.resetResult();
    this.resetContact();
  }

}
