import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from "rxjs/operators"
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes?: Cliente[]
  paginator?: any

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    let page = 0;
    this.activatedRoute.params.subscribe((params) => {
      page = params["page"]

      if (!page) page = 0;
      this.clienteService.getClientesPagination(page).pipe(
        tap(response => this.clientes = response.content),
      ).subscribe(
        response => this.paginator = response
      )
    })
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: `Estas seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes?.filter(cli => cli !== cliente)
          Swal.fire("Cliente eliminado", "cliente eliminado con exito!", "success")
        })
      }
    })
  }

}
