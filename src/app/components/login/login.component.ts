import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES_API, SYSTEM_NAME } from 'src/app/config/constants';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StorageService } from 'src/app/services/storage.service';
import { dinamicKey } from '../../interfaces/allTypes'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  sysName: string = SYSTEM_NAME
  errors: dinamicKey = {
    username:'',
    password:'',
    submit: '',
    length: 'Ha excedido el limite de caracteres permitidos',
  }
  errorsTxt:dinamicKey = {
    username:'usuario',
    password:'contraseña',
  }

  login: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(64)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(64)])
  })

  constructor(
    private restApi: RestApiService,
    private storageService: StorageService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.validateInputs('username')
    this.validateInputs('password')
  }

  getErrorEmpty(input:string) {
    return `Debes completar el campo de ${this.errorsTxt[input]}`
  }

  sendData() {
    if(this.login.valid) {
      this.restApi.doPost(ROUTES_API.login, this.login.value).subscribe((data:any) => {
        if(data.access) {
          this.storageService.setStorage(data.info)
          this.router.navigate(['dashboard/home'])
        }
        if(data.error) {
          this.errors['submit'] = data.message
        }
      })
    } else {
      this.validateForm()
    }
  }

  validateInputs(inputName: string){
    const formControl = this.login.get(inputName);
    formControl?.valueChanges.subscribe((value) => {
      this.verifyErrors(inputName)
    })
  }

  validateForm(){
    const keys = Object.keys(this.login.value)
    keys.forEach(key => {
      this.verifyErrors(key)
    })
  }

  verifyErrors(inputName: string) {
    const formControl = this.login.get(inputName);
    if (formControl?.hasError('required')) {
      this.errors[inputName] = this.getErrorEmpty(inputName)
      return
    }
    if (formControl?.hasError('maxlength')) {
      this.errors[inputName] = `El campo ${this.errorsTxt[inputName]} ha excedido el máximo de caracteres.`
      return
    }
    this.errors[inputName] = '';
  }

}
