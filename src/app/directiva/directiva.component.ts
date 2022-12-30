import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {

  constructor() { }
  habilitar: boolean = true;
  listaCursos: string[] = ['Java', 'C++', 'C', 'Kotlin']
  ngOnInit(): void {
  }

}
