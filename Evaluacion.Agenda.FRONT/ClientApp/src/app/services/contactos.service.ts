import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  constructor(private http: HttpClient) { }

  get(numRegistros:number, numPagina:number){
    let params = new HttpParams();
    params = params.append('numRegistros', numRegistros.toString() );
    params = params.append('pagina', numPagina.toString() );

    return this.http.get<ResponseContactoModel>(`${environment.apiUrl}/Contacto`, { params });
  }

  post(contacto:Contacto) {
    console.log('contacto > ', contacto);
    return this.http.post<OperationResult>(`${environment.apiUrl}/Contacto`, contacto );
  }

  put(contacto:Contacto) {
    return this.http.put<OperationResult>(`${environment.apiUrl}/Contacto`, contacto);
  }

  delete(contacto:Contacto) {
    return this.http.delete<OperationResult>(`${environment.apiUrl}/Contacto?id=${contacto.id}`);
  }

}
