import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ContactosService } from '../services/contactos.service';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogService } from './../services/confirm-dialog.service';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.css']
})
export class ListaContactosComponent implements OnInit {

  public listContactos: Contacto[];
  public totalContactos: number;
  public pageIndex:number = 0;
  public pageSize:number = 10;
  public msj:string;
  public result: OperationResult;
  public pageOfItems: Array<any>;
  items = [];

  contacto:Contacto;
  constructor(http: HttpClient, private contactService:ContactosService, private modal:NgbModal, private confirmDialogService: ConfirmDialogService) {
    this.resetContact();
    this.resetResult();
  }

  ngOnInit() {
    this.getContacts(this.pageSize, this.pageIndex + 1);  
  }

  loadNPages(){
    this.items = Array( this.totalContactos ).fill(0).map((x, i) => ({ id: (i + 1), name: `i${i + 1}`, nPage : Math.ceil((i+1)/this.pageSize)}));
  }  

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
    if (this.pageOfItems.length == 0) {
      this.pageIndex = 0
    }else{
      this.pageIndex = this.pageOfItems[0].nPage;
    }

    this.contactService.get(this.pageSize, this.pageIndex)
    .pipe(first())
    .subscribe(
      data => {
        this.listContactos = data.listContactos;
        this.totalContactos = data.totalGlobal;
      },
      error => {
        console.error("Error > ", error);
      });
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
        this.loadNPages();
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

  Delete(contacto:Contacto) {
    this.contactService.delete(contacto)
    .pipe(first())
    .subscribe(
      data => {
        this.result = data;
        if (data.success)
        {
          this.resetResult();
          this.getContacts(this.pageSize, this.pageIndex + 1);
        }     
      },
      error => {
        console.error("Error > ", error);
      }
    );  
  }

  Eliminar(contacto:Contacto) {  
    this.confirmDialogService.confirmThis("¿Está seguro que desea eliminar el contacto seleccionado?",  () => {    
        this.Delete(contacto);
    }, () => {  
    })  
  }  

}
