import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormTitle, StatusType, UserData, formTitle } from 'src/app/interfaces/allTypes';
import { RestApiService } from 'src/app/services/rest-api.service';
import { FORM_TITLES } from 'src/app/utilities/constants';
import { cedulaEcuatorianaValidator, passwordValidator, usernameValidator } from 'src/app/utilities/functions';
import { nameRegex } from 'src/app/utilities/regExp';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  /** PROPIEDADES DE LA TABLA */
  sectionName:string = 'Usuarios'
  path: string = 'http://localhost:4000/user'
  theads: string[] = ['N°', 'Cédula', 'Nombre', 'Apellidos', 'Usuario', 'Estado', ' Opciones']
  fields: string[] = [
    'index',
    'dni',
    'name',
    'surname',
    'username',
    'user_status_name'
  ]

  /** PROPIEDADES DEL COMPONENTE */
  hasChanged = false // Propiedad para refresh tabla
  isVisible:boolean = false // Propiedad para ocultar o mostrar formulario
  status_types: StatusType[] = [] // Lista de typos de choferes
  formTitle: formTitle = FORM_TITLES.none // Titulo que tendrá el formulario
  formTitles: FormTitle = FORM_TITLES // Titulo que tendrá el formulario
  areErrors: boolean = false // Si hay errores con los campos al enviar
  newRegister: boolean = false; // Si el formulario es o no para agregar nuevo
  passWillBeUpdated: boolean = false
  passWillBeShowed: boolean = false

  // Datos para poder usar la ventana de alerta
  modalAlert: any = {
    title: '',
    isVisible: false,
    message: '',
    actions: {
      accept: () => {},
      cancel: () => {}
    }
  }

  // Datos para los mensajes de error del formulario modal
  errors: any = {
    dni:'',
    name: '',
    surname: '',
    username: '',
    password: '',
    user_status_id: ''
  }

  // Data inicial del formulario modal
  initialData: UserData = {
    id: 0,
    dni: '',
    name: '',
    surname: '',
    username: '',
    password: '',
    user_status_id: ''
  }

   // Validadores de todos los campos del formulario modal
  errorMessagesValidator: any = {
    dni: (name:string) => this.validateCC(name),
    name: (name:string) => this.validateName(name),
    surname: (name:string) => this.validateName(name),
    username: (name:string) => this.validateUsername(name),
    password: (name:string) => this.validatePassword(name),
    user_status_id: (name:string) => this.validateStatusType(name)
  }
  // Inicializo el formulario con la data inicial
  selected: UserData = this.initialData
  // Patron para validar las placas
  platePattern: RegExp = /^[A-Z]{3}-\d{3,4}$/

  // Datos del formulario
  formData: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    dni: new FormControl('', [Validators.required, cedulaEcuatorianaValidator()]),
    name: new FormControl('', [Validators.required, Validators.pattern(nameRegex)]),
  surname: new FormControl('', [Validators.required, Validators.pattern(nameRegex)]),
    username: new FormControl('', [Validators.required, usernameValidator()]),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    user_status_id: new FormControl('', Validators.required)
  })

  constructor(
    private restApi: RestApiService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStatusTypes()
  }

  loadStatusTypes() {
    this.restApi.doGet(`${this.path}/types`).subscribe((data:any) => {
      try {
        if(data.result[0]) {
          this.status_types = data.result[1]
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

  /* Funcion para preparar las ventanas modal */
  enableAlertModal(title: string, message: string, icon:string, accept: Function, cancel: Function) {
    this.modalAlert.title = title
    this.modalAlert.message = message
    this.modalAlert.icon = icon
    this.modalAlert.actions.accept = accept
    this.modalAlert.actions.cancel = cancel
    this.modalAlert.isVisible = true
    this.cdr.markForCheck()
  }

  /* Habilita o deshabilita el campo de contraseña */
  showPasswordField(event: any) {
    if(event.target.checked) {
      this.passWillBeUpdated = true
    } else {
      this.passWillBeUpdated = false
    }
  }

  /* Muestra u oculta la contraseña */
  showPassword(event: any) {
    if(event.target.checked) {
      this.passWillBeShowed = true
    } else {
      this.passWillBeShowed = false
    }
  }

  /* Prepara los datos que serán actualizados y muestra el formulario editar */
  prepareFormToUpdate(data: any) {
    let clone = {
      id: data.id,
      dni: data.dni,
      name: data.name,
      surname: data.surname,
      password: data.password,
      username: data.username,
      user_status_id: data.user_status_id
    }
    this.formTitle = FORM_TITLES.edit
    this.isVisible = true
    this.selected = data
    this.formData.setValue(clone)
  }

  /* Limpia el formulario para ingresar nuevos datos y lo muestra */
  prepareFormToAdd() {
    this.formTitle = FORM_TITLES.add
    this.isVisible = true
    this.selected = this.initialData
    this.formData.setValue(this.initialData)
    this.newRegister = true
  }

     /* Validaciones individuales de los campos */
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

  validateUsername(name: string) {
    const input = this.formData.get(name)
    // Si esta vacio
    if (input?.value === "") {
      this.errors[name] = `Debes ingresar un nombre de usuario`
      return
    }

    // Si tiene espacios dobles, tambien al pricipio o al final
    if (input?.hasError('invalidUsername')) {
      this.errors[name] = 'Nombre de usuario invalido. Debe contener mínimo 8 caracteres, al menos una letra minúscula, una mayúscula, un número y un caracter especial, no se aceptan espacios en blanco.'
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

    // Si intenta escribir un nombre
    this.errors[name] = ""
  }

  validatePassword(name: string) {
    const input = this.formData.get(name)
    // Si esta vacio
    if (input?.value === "") {
      this.errors[name] = `Debes ingresar una contraseña`
      return
    }

    // Si tiene espacios dobles, tambien al pricipio o al final
    if (input?.hasError('invalidPassword')) {
      this.errors[name] = 'Contraseña invalida. Debe contener mínimo 8 caracteres, al menos una letra minúscula, una mayúscula, un número y un caracter especial, no se aceptan espacios en blanco.'
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

    // Si intenta escribir un nombre
    this.errors[name] = ""
  }

  validateStatusType(name: string) {
    const input = this.formData.get(name)
    if (input?.value === "") {
      this.errors[name] = "Debes seleccionar el estado"
      return
    }
    this.errors[name] = ""
  }


  /* Detecta cuando estamos escribriendo en los campos del formulario */
  detectChange(event: any) {
    const name = event.target.name
    this.errorMessagesValidator[name](name)
    this.cdr.markForCheck() // Actualiza la interfaz para mostrar los errores
  }

  /* Carga los datos del formulario de agregar nuevo */
  prepareToAdd() {
    this.enableAlertModal(
      "Atención",
      '¿Desea guardar este registro?',
      'info',
      () => this.addData(),
      () => this.modalAlert.isVisible = false
    )
  }

  /* Carga los datos del formulario de editar registro */
  prepareToUpdate() {
    this.enableAlertModal(
      "Atención",
      '¿Desea actualizar este registro?',
      'info',
      () => this.updateData(),
      () => this.modalAlert.isVisible = false
    )
  }

  /* Carga el id del registro que se desea eliminar */
  prepareToDelete(id:string | number) {
    this.enableAlertModal(
      "Atención",
      '¿Desea eliminar este registro?',
      'danger',
      () =>this.deleteData(id),
      () => this.modalAlert.isVisible = false
    )
  }

  /* Actualiza los datos de un registro de las base de datos*/
  updateData() {
    this.modalAlert.isVisible = false
    // Validamos que no este seleccionado actualizar contraseña
    const errorsList: string[] = this.getFormGroupErrors(this.formData)
    const notPassword = errorsList.includes('password: required')
    const isInvalidPass = errorsList.includes('password: invalidPassword')
    // Si no ha seleccionado cambiar contraseña podrá actualizar sin problema
    const canSend = notPassword && isInvalidPass && !this.passWillBeUpdated

    if(this.formData.valid || canSend ) {
      this.restApi.doPost(`${this.path}/update`, this.formData.value).subscribe((data:any) => {
        if(data.result[0]) {
          this.enableAlertModal(
            "Hecho",
            'Datos actualizados correctamente',
            'done',
            () => this.resetFormAndClose(),
            () => this.resetFormAndClose()
          )
          this.hasChanged = true
        } else {
          this.enableAlertModal(
            "Error",
            data.result[1].error,
            'error',
            () => {this.modalAlert.isVisible = false},
            () => {this.modalAlert.isVisible = false},
          )
        }
      })
    } else {
      this.areErrors = true
    }
  }

  /* Añade nuevo registro en la base de datos */
  addData() {
    this.modalAlert.isVisible = false
    if(this.formData.valid) {
      this.restApi.doPost(`${this.path}/new`, this.formData.value).subscribe((data:any) => {
        if(data.result[0]) {
          this.enableAlertModal(
            "Hecho",
            'Registro agregado correctamente',
            'done',
            () => this.resetFormAndClose(),
            () => this.resetFormAndClose()
          )
          this.hasChanged = true
          this.areErrors = false
        } else{
          this.enableAlertModal(
            "Error",
            data.result[1].error,
            'error',
            () => {this.modalAlert.isVisible = false},
            () => {this.modalAlert.isVisible = false},
          )
        }
      })
    } else {
      this.areErrors = true
    }
  }

  /* Elimina registro en la base de datos */
  deleteData(id:string | number) {
    this.modalAlert.isVisible = false
    this.areErrors = true
    this.restApi.doPost(`${this.path}/delete`, {id}).subscribe((data:any) => {
      if(data.result[0]) {
        this.enableAlertModal(
          "Hecho",
          'Registro eliminado correctamente',
          'done',
          () => this.resetFormAndClose(),
          () => this.resetFormAndClose()
        )
        this.hasChanged = true
        this.areErrors = false
      } else {
        this.enableAlertModal(
          "Error",
          data.result[1].error,
          'error',
          () => {this.modalAlert.isVisible = false},
          () => {this.modalAlert.isVisible = false},
        )
      }
    })
  }

  // Obtener todos los errores que tenga activos el formulario
  getFormGroupErrors(formGroup: FormGroup): string[] {
    const errors: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const controlErrors = formGroup.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(errorKey => {
          errors.push(`${key}: ${errorKey}`);
        });
      }
    });

    return errors;
  }

  /* Limpiar el formulario luego de realizar acción */
  resetFormAndClose() {
    this.formData.reset()
    this.formData.get('type_id')?.setValue('')
    this.isVisible = false
    this.modalAlert.isVisible = false
    this.hasChanged = false
    this.newRegister = false
    this.selected = this.initialData
    this.areErrors = false
    Object.keys(this.errors).forEach((key:string) => {
      this.errors[key] = ''
    })
  }
}
