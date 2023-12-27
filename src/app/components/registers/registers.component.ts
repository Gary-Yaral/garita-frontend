import { ChangeDetectorRef, Component } from '@angular/core';
import { ROUTES_API } from 'src/app/config/constants';
import { Driver, ModalProps } from 'src/app/interfaces/allTypes';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { CHANGES_TYPE, DEFAULT_DATA_MODAL, REGISTER_FORM_TYPES } from 'src/app/utilities/constants';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.css']
})
export class RegistersComponent {
   /** PROPIEDADES DE LA TABLA */
   sectionName:string = 'Registros'
   path: string = ROUTES_API.register // Ruta a donde se harán las peticiones
   theads: string[] = [
    'N°',
    'Cédula',
    'Usuario',
    'Chofér',
    'Apellidos',
    'Placa',
    'Tipo de registro',
    'Tipo Vehiculo',
    'Kilometros',
    'Observacion',
    'Destino',
    'Fecha',
    'Opciones'
  ]
   fields: string[] = [
    'index',
    'dni',
    'username',
    'driver_name',
    'plate_number',
    'access_type',
    'register_type',
    'vehicle_type',
    'kms',
    'observation',
    'destiny',
    'registered_date'
  ]

   /** PROPIEDADES DEL COMPONENTE */
   isVisible:boolean = false // Propiedad para ocultar o mostrar formulario

   // Datos para poder usar la ventana de alerta
   modalAlert: ModalProps = {...DEFAULT_DATA_MODAL}

   // Datos para los mensajes de error del formulario modal
   errors: any = {
     dni: '',
     name: '',
     surname: '',
     type: ''
   }
   // Data inicial del formulario modal
   initialData: Driver = {
     dni: '',
     id: 0,
     name: '',
     surname: '',
     type_id: '',
     type: 'none'
   }

   constructor(
     private restApi: RestApiService,
     private cdr: ChangeDetectorRef,
     private reload: ReloadService) {}

   ngAfterViewInit(): void {}

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

   /* Prepara los datos que serán actualizados y muestra el formulario editar */
   prepareFormToUpdate(data: any) {
     this.reload.setFormAction({show: true, type: REGISTER_FORM_TYPES.UPDATE, id: data.id})
   }

   /* Limpia el formulario para ingresar nuevos datos y lo muestra */
   prepareFormToAdd() {
     this.reload.setFormAction({show: true, type: REGISTER_FORM_TYPES.ADD})
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

   /* Elimina registro en la base de datos */
   deleteData(id:string | number) {
     this.modalAlert.isVisible = false
     this.restApi.doPost(`${this.path}/delete`, {id}).subscribe((data:any) => {
       if(data.result[0]) {
         this.enableAlertModal(
           "Hecho",
           'Registro eliminado correctamente',
           'done',
           () => ()=>{},
           () => ()=>{}
         )
         this.reload.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
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

}
