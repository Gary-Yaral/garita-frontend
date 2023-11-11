import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Driver, DriverType } from 'src/app/interfaces/allTypes';
import { RestApiService } from 'src/app/services/rest-api.service';
import { cedulaEcuatorianaValidator } from 'src/app/utilities/functions';
import { nameRegex } from 'src/app/utilities/regExp';

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
  types: DriverType[] = []
  errors: any = {
    dni: '',
    name: '',
    surname: '',
    type: ''
  }
  initialData: Driver = {
    dni: '',
    id: 0,
    name: '',
    surname: '',
    type_id: 0,
    type: ''
  }

  errorMessagesValidator: any = {
    dni: (name:string) => this.validateCC(name),
    name: (name:string) => this.validateName(name),
    surname: (name:string) => this.validateName(name),
    type_id: (name:string) => this.validateType(name)
  }
  selected: Driver = this.initialData

  formData: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    dni: new FormControl('', [Validators.required, cedulaEcuatorianaValidator()]),
    name: new FormControl('', [Validators.required, Validators.pattern(nameRegex)]),
    surname: new FormControl('', [Validators.required, Validators.pattern(nameRegex)]),
    type_id: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)
  })

  constructor(
    private restApi: RestApiService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.restApi.doGet(`${this.path}/types`).subscribe((data:any) => {
      try {
        if(data.result[0]) {
          this.types = data.result[1]
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

  receiveData(data: any) {
    this.isVisible = true
    this.selected = data
    this.formData.setValue(data)
  }

  closeModal() {
    this.isVisible = false
    this.selected = this.initialData

  }

  validateCC(name: string) {
    const input = this.formData.get(name)
    if (input?.value === "") {
      this.errors[name] = "Debes ingresar un número de cédula de identidad"
      return
    }
    if (input?.hasError('cedulaEcuatoriana')) {
      this.errors[name] = "Cedula invalida, asegurese de ingresar cédula valida con 10 dígitos"
      return
    }
    this.errors[name] = ""
  }

  validateName(name: string) {
    const input = this.formData.get(name)
    const txt = name === 'name' ? 'Nombre': 'Apellido'
    // Si esta vacio
    if (input?.value === "") {
      this.errors[name] = `Debes ingresar un ${txt.toLowerCase()}`
      return
    }
    // Si tiene espacios dobles, tambien al pricipio o al final
    if (input?.hasError('pattern')) {
      this.errors[name] = `${txt} invalido. No se aceptan espacios dobles, tampoco espacios al inicio o al final. Solo letras mayusculas y minúsculas, con o sin tilde`
      // Si aun teniendo el error intenta escribir más de 64 caracteres
      if(input?.value.length > 64) {
        input?.setValue(input?.value.slice(0,64));
        this.errors[name] = 'Solo se permiten hasta 64 caracteres'
        return
      }
      return
    }
    // Si intenta escribir más de 64 caracteres
    if(input?.value.length === 65) {
      input?.setValue(input?.value.slice(0,64));
      this.errors[name] = 'Solo se permiten hasta 64 caracteres'
      return
    }

    // Si intenta escribir más de dos nonbres
    const words = input?.value.split(' ')
    if(words.length > 2) {
      this.errors[name] = `Solo se permiten dos ${txt.toLowerCase()}s`
      return
    }
    // Si intenta escribir algunos de los datos muy largo
    if(words.length === 2) {
      if(words[0].length > 25 || words[1].length > 25) {
        this.errors[name] = `Los ${txt.toLowerCase()}s o alguno de ellos tiene más de 25 caracteres`
        return
      }
    }

    // Si intenta escribir un dato muy largo
    if(words.length === 1) {
      if(words[0].length > 25) {
        this.errors[name] = `El ${txt.toLowerCase()} tiene más de 25 caracteres`
        return
      }
    }
    // Si intenta escribir un nombre
    this.errors[name] = ""
  }

  validateType(name: string) {
    const input = this.formData.get(name)
    if (input?.value === "") {
      this.errors[name] = "Debes seleccionar el tipo de chofer"
      return
    }
    this.errors[name] = ""
  }

  detectChange(event: any) {
    const name = event.target.name
    this.errorMessagesValidator[name](name)
    this.cdr.markForCheck()
  }

  sendData() {
    if(this.formData.valid) {
      this.restApi.doPost(`${this.path}/update`, this.formData.value).subscribe((data:any) => {
        console.log(data);

      })
      console.log(this.formData.value);

    }
  }

  resetForm() {
    this.formData.reset()
    this.formData.get('type_id')?.setValue('')
    this.isVisible = false
    Object.keys(this.errors).forEach((key:string) => {
      this.errors[key] = ''
    })
  }
}
