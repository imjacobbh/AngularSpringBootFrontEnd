import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente!: Cliente;
  titulo: string = "Detalle del cliente"
  imageSelected!: File | null
  progress: number = 0;

  constructor(private clienteService: ClienteService,  public modalService: ModalService) { }

  ngOnInit(): void { }

  seleccionarFoto(event: any) {
    if (event.target.files[0].type.indexOf('image') < 0) {
      Swal.fire("Error", 'debe seleccionar un archivo del tipo imagen', 'error')
      return
    }
    this.progress = 0;
    this.imageSelected = event.target.files[0];
    console.log(this.imageSelected)
  }

  subirFoto() {
    if (!this.imageSelected) {
      Swal.fire("Error al subir", ' debe seleccionar una foto', 'error')
      return
    }
    this.clienteService.subirFoto(this.imageSelected, this.cliente.id).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((event.loaded / event.total!) * 100)
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body
          this.cliente = response.cliente as Cliente
          this.modalService.notifyUpload.emit(this.cliente)
          Swal.fire("La foto se ha subido correctamente", this.cliente.foto, 'success')

        }
      }
    )
  }

  cerrarModal() {
    this.modalService.cerrarModal()
    this.progress = 0;
    this.imageSelected = null
  }
}
