import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, throwError, map, tap } from 'rxjs'
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Injectable()
export class ClienteService {

  private urlEndpoint: string = "http://localhost:8080/api/clientes"
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private httpClient: HttpClient, private router: Router) { }


  getClientesPagination(page: number): Observable<any> {
    return this.httpClient.get(`${this.urlEndpoint}/page/${page}`).pipe(
      tap((response: any) => {
        console.log("ClienteService: tap #1");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map(response => {
        (response.content as Cliente[]).forEach(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        })
        return response;
      }
      ),
      tap((response: any) => {
        console.log("ClienteService: tap #2");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      })

    )
  }

  getClientes(): Observable<Cliente[]> {
    return this.httpClient.get(this.urlEndpoint).pipe(
      tap(response => {
        console.log("tap #1")
        let clientes = response as Cliente[]
        clientes.forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),

      map(response => {
        let clientes = response as Cliente[]
        return clientes.map(
          cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            return cliente;
          }
        );
      }),//map ya cambió a tipo cliente[], por tanto acá no es necesario el casteo
      tap(response => {
        console.log("tap #2")
        response.forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),
    )
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post(this.urlEndpoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(() => e);
        }
        Swal.fire("Error al crear cliente", e.error.mensaje, 'error');
        return throwError(() => e);
      })
    )
  }

  getCliente(id: any): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        Swal.fire("Error", e.error.mensaje, 'error');
        this.router.navigate(['/clientes']);
        return throwError(() => e);
      })
    )
  }

  updateCliente(cliente: Cliente): Observable<any> {
    return this.httpClient.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        Swal.fire("Error al actualizar", e.error.mensaje, 'error');
        return throwError(() => e);
      })
    )
  }

  delete(id: number): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.urlEndpoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire("Error al eliminar", e.error.mensaje, 'error');
        return throwError(() => e);
      })
    )
  }

  subirFoto(archivo: File, id: any): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("file", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, {
      reportProgress: true
    })
    return this.httpClient.request(req)
  }
}
