import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  cliente!: Cliente;
  titulo:string= "Detalle del cliente"
  private imageSelected!: File

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
      let id = params.get("id")
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        })
      }
    })
  }

  seleccionarFoto(event: any){
    this.imageSelected = event.target.files[0];
    console.log(this.imageSelected)
  }

  subirFoto(){
    this.clienteService.subirFoto(this.imageSelected, this.cliente.id).subscribe(
      clente => {
        this.cliente = clente;
        Swal.fire("La foto se ha subido correctamente", this.cliente.foto ,  'success')
      }
    )
  }
}
