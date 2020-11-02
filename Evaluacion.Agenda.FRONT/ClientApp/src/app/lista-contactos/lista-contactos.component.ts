import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ContactosService } from '../services/contactos.service';
import { first } from 'rxjs/operators';

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

  constructor(http: HttpClient, private contactService:ContactosService) {
  
  }

  ngOnInit() {
    this.getContacts(this.pageSize, this.pageIndex + 1);
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

}
