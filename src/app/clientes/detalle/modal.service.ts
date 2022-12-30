import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _notifyUpload = new EventEmitter<any>();
  modal: boolean = false
  constructor() { }


  get notifyUpload(): EventEmitter<any> {
    return this._notifyUpload
  }
  
  abrirModal() {
    this.modal = true;
  }
  cerrarModal() {
    this.modal = false
  }
}
