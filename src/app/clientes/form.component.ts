import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  titulo: string = "Crear Cliente"
  cliente?: Cliente
  clienteForm: FormGroup
   errores: string[] = [];

  constructor(private formBuilder: FormBuilder, private clientesService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.clienteForm = this.formBuilder.group({
      nombre: ["", [Validators.required, Validators.minLength(3)]],
      apellido: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.email, Validators.required]],
      createdAt: ["", [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params["id"]

      if (id) {
        this.clientesService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
          this.clienteForm.setValue({ nombre: cliente.nombre, apellido: cliente.apellido, email: cliente.email, createdAt: cliente.createdAt });
        })
      }
    })
  }

  create() {
    let cliente = this.clienteForm.value
    this.clientesService.create(cliente).subscribe(
      response => {
        this.router.navigate(['clientes'])
        Swal.fire("Nuevo Cliente", `El cliente ${cliente.nombre} fue añadido`, 'success')
      },
      error => {
        this.errores = error.error.errores as string[];

      }
    )
  }

  update() {
    if (this.cliente != null) {
      this.cliente.nombre = this.clienteForm.value.nombre
      this.cliente.apellido = this.clienteForm.value.apellido
      this.cliente.email = this.clienteForm.value.email
      this.cliente.createdAt = this.clienteForm.value.createdAt
      
      this.clientesService.updateCliente(this.cliente!).subscribe(
        response => {
          this.router.navigate(['clientes'])
          Swal.fire("Cliente editado", `${response.mensaje}: ${response.cliente.nombre}`, 'success')
        },
        error => {
          this.errores = error.error.errores as string[];
        }
      )
    }

  }


}
