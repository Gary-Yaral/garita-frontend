import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Driver } from 'src/app/interfaces/allTypes';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  sectionName:string = 'Choferes'
  path: string = 'http://localhost:4000/driver'
  theads: string[] = ['N°', 'Cédula', 'Apellidos', 'Nombres', 'Tipo', ' Opciones']
  fields: string[] = ['index','dni','name', 'surname', 'type']

  isVisible:boolean = false
  initialData: Driver = {
    dni: '',
    id: 0,
    name: '',
    surname: '',
    type_id: 0,
    type: ''
  }
  selected: Driver = this.initialData

  formData: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    dni: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    type_id: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)
  })
  constructor() {

  }
  ngOnInit(): void {
  }

  receiveData(data: any) {
    this.isVisible = true
    this.selected = data
    this.formData.setValue(data)
    console.log("hola", data);
  }

  closeModal() {
    this.isVisible = false
    this.selected = this.initialData
    console.log('clcik');

  }
}
