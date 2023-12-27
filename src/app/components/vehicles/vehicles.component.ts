import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ROUTES_API } from 'src/app/config/constants';
import { ModalProps, Vehicle, VehicleType } from 'src/app/interfaces/allTypes';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StorageService } from 'src/app/services/storage.service';
import { CHANGES_TYPE, DEFAULT_DATA_MODAL } from 'src/app/utilities/constants';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
})
export class VehiclesComponent implements AfterViewInit {
  /** PROPIEDADES DE LA TABLA */
  sectionName: string = 'Vehículos';
  path: string = ROUTES_API.vehicle; // Ruta a donde se harán las peticiones
  theads: string[] = [
    'N°',
    'Placa',
    'Acceso',
    'Vehiculo',
    'Estado',
    ' Opciones',
  ];
  fields: string[] = [
    'index',
    'plate_number',
    'access_type_name',
    'vehicle_type_name',
    'status_type_name',
  ];

  /** PROPIEDADES DEL COMPONENTE */
  isVisible: boolean = false; // Propiedad para ocultar o mostrar formulario
  vehicle_types: VehicleType[] = []; // Lista de typos de choferes
  access_types: VehicleType[] = []; // Lista de typos de choferes
  status_types: VehicleType[] = []; // Lista de typos de choferes
  formTitle: string = ''; // Titulo que tendrá el formulario
  areErrors: boolean = false; // Si hay errores con los campos al enviar
  newRegister: boolean = false; // Si el formulario es o no para agregar nuevo

  // Datos para poder usar la ventana de alerta
  modalAlert: ModalProps = {...DEFAULT_DATA_MODAL}

  // Datos para los mensajes de error del formulario modal
  errors: any = {
    plate_number: '',
    access_type_id: '',
    vehicle_type_id: '',
    status_type_id: '',
  };
  // Data inicial del formulario modal
  initialData: Vehicle = {
    id: 0,
    plate_number: '',
    access_type_id: '',
    status_type_id: '',
    vehicle_type_id: '',
  };

  // Validadores de todos los campos del formulario modal
  errorMessagesValidator: any = {
    plate_number: (name: string) => this.validatePlate(name),
    access_type_id: (name: string) => this.validateAccessType(name),
    vehicle_type_id: (name: string) => this.validateVehicleType(name),
    status_type_id: (name: string) => this.validateStatusType(name),
  };
  // Inicializo el formulario con la data inicial
  selected: Vehicle = this.initialData;
  // Patron para validar las placas
  platePattern: RegExp = /^[A-Z]{3}-\d{3,4}$/;

  // Datos del formulario
  formData: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    plate_number: new FormControl('', [
      Validators.required,
      Validators.pattern(this.platePattern),
    ]),
    access_type_id: new FormControl('', Validators.required),
    vehicle_type_id: new FormControl('', Validators.required),
    status_type_id: new FormControl('', Validators.required),
  });

  constructor(
    private restApi: RestApiService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private reload: ReloadService
  ) {}

  ngAfterViewInit(): void {
    this.storageService.formDataVehicle$.subscribe((data: any) => {
      if (data) {
        this.vehicle_types = data.vehicles_types;
        this.access_types = data.access_types;
        this.status_types = data.status_types;
      }
    });
  }

  /* Funcion para preparar las ventanas modal */
  enableAlertModal(
    title: string,
    message: string,
    icon: string,
    accept: Function,
    cancel: Function
  ) {
    this.modalAlert.title = title;
    this.modalAlert.message = message;
    this.modalAlert.icon = icon;
    this.modalAlert.actions.accept = accept;
    this.modalAlert.actions.cancel = cancel;
    this.modalAlert.isVisible = true;
    this.cdr.markForCheck();
  }

  /* Prepara los datos que serán actualizados y muestra el formulario editar */
  prepareFormToUpdate(data: any) {
    this.formTitle = 'Editar';
    this.isVisible = true;
    this.selected = data;
    let clone = {
      id: data.id,
      plate_number: data.plate_number,
      access_type_id: data.access_type_id,
      vehicle_type_id: data.vehicle_type_id,
      status_type_id: data.status_type_id,
    };
    this.formData.setValue(clone);
  }

  /* Limpia el formulario para ingresar nuevos datos y lo muestra */
  prepareFormToAdd() {
    this.formTitle = 'Agregar';
    this.isVisible = true;
    this.selected = this.initialData;
    this.formData.setValue(this.initialData);
    this.newRegister = true;
  }

  validatePlate(name: string) {
    const input = this.formData.get(name);
    // Si esta vacio
    if (input?.value === '') {
      this.errors[name] = `Debes ingresar una placa valida`;
      return;
    }
    // Si la placa no es valida
    if (input?.hasError('pattern')) {
      this.errors[
        name
      ] = `Número de placa invalido. Solo se aceptan 3 letras, un guion, de 3 a 4 números`;
      // Si aun teniendo el error intenta escribir más de 10 caracteres
      if (input?.value.length > 10) {
        input?.setValue(input?.value.slice(0, 10));
        this.errors[name] = 'Solo se permiten hasta 10 caracteres';
        return;
      }
      return;
    }
    // Si intenta escribir más de 10 caracteres
    if (input?.value.length === 10) {
      input?.setValue(input?.value.slice(0, 10));
      this.errors[name] = 'Solo se permiten hasta 10 caracteres';
      return;
    }

    // Si no hay error limpiamos el cuadro de error
    this.errors[name] = '';
  }

  validateAccessType(name: string) {
    const input = this.formData.get(name);
    if (input?.value === '') {
      this.errors[name] = 'Debes seleccionar el tipo de acceso';
      return;
    }
    this.errors[name] = '';
  }

  validateVehicleType(name: string) {
    const input = this.formData.get(name);
    if (input?.value === '') {
      this.errors[name] = 'Debes seleccionar el tipo de vehículo';
      return;
    }
    this.errors[name] = '';
  }

  validateStatusType(name: string) {
    const input = this.formData.get(name);
    if (input?.value === '') {
      this.errors[name] = 'Debes seleccionar el tipo de estado';
      return;
    }
    this.errors[name] = '';
  }

  /* Detecta cuando estamos escribriendo en los campos del formulario */
  detectChange(event: any) {
    const name = event.target.name;
    this.errorMessagesValidator[name](name);
    this.cdr.markForCheck(); // Actualiza la interfaz para mostrar los errores
  }

  /* Carga los datos del formulario de agregar nuevo */
  prepareToAdd() {
    this.enableAlertModal(
      'Atención',
      '¿Desea guardar este registro?',
      'info',
      () => this.addData(),
      () => (this.modalAlert.isVisible = false)
    );
  }

  /* Carga los datos del formulario de editar registro */
  prepareToUpdate() {
    this.enableAlertModal(
      'Atención',
      '¿Desea actualizar este registro?',
      'info',
      () => this.updateData(),
      () => (this.modalAlert.isVisible = false)
    );
  }

  /* Carga el id del registro que se desea eliminar */
  prepareToDelete(id: string | number) {
    this.enableAlertModal(
      'Atención',
      '¿Desea eliminar este registro?',
      'danger',
      () => this.deleteData(id),
      () => (this.modalAlert.isVisible = false)
    );
  }

  /* Actualiza los datos de un registro de las base de datos*/
  updateData() {
    this.modalAlert.isVisible = false;
    if (this.formData.valid) {
      this.restApi
        .doPost(`${this.path}/update`, this.formData.value)
        .subscribe((data: any) => {
          if (data.result[0]) {
            this.enableAlertModal(
              'Hecho',
              'Datos actualizados correctamente',
              'done',
              () => this.resetFormAndClose(),
              () => this.resetFormAndClose()
            );
            this.reload.addChanges({
              changes: true,
              type: CHANGES_TYPE.UPDATE,
            });
          } else {
            this.enableAlertModal(
              'Error',
              data.result[1].error,
              'error',
              () => {
                this.modalAlert.isVisible = false;
              },
              () => {
                this.modalAlert.isVisible = false;
              }
            );
          }
        });
    } else {
      this.areErrors = true;
    }
  }

  /* Añade nuevo registro en la base de datos */
  addData() {
    this.modalAlert.isVisible = false;
    if (this.formData.valid) {
      this.restApi
        .doPost(`${this.path}/new`, this.formData.value)
        .subscribe((data: any) => {
          if (data.result[0]) {
            this.enableAlertModal(
              'Hecho',
              'Registro agregado correctamente',
              'done',
              () => this.resetFormAndClose(),
              () => this.resetFormAndClose()
            );
            this.reload.addChanges({ changes: true, type: CHANGES_TYPE.ADD });
            this.areErrors = false;
          } else {
            this.enableAlertModal(
              'Error',
              data.result[1].error,
              'error',
              () => {
                this.modalAlert.isVisible = false;
              },
              () => {
                this.modalAlert.isVisible = false;
              }
            );
          }
        });
    } else {
      this.areErrors = true;
    }
  }

  /* Elimina registro en la base de datos */
  deleteData(id: string | number) {
    this.modalAlert.isVisible = false;
    this.areErrors = true;
    this.restApi
      .doPost(`${this.path}/delete`, { id })
      .subscribe((data: any) => {
        if (data.result[0]) {
          this.enableAlertModal(
            'Hecho',
            'Registro eliminado correctamente',
            'done',
            () => this.resetFormAndClose(),
            () => this.resetFormAndClose()
          );
          this.reload.addChanges({ changes: true, type: CHANGES_TYPE.DELETE });
          this.areErrors = false;
        } else {
          this.enableAlertModal(
            'Error',
            data.result[1].error,
            'error',
            () => {
              this.modalAlert.isVisible = false;
            },
            () => {
              this.modalAlert.isVisible = false;
            }
          );
        }
      });
  }

  /* Limpiar el formulario luego de realizar acción */
  resetFormAndClose() {
    this.formData.reset();
    this.formData.get('type_id')?.setValue('');
    this.isVisible = false;
    this.modalAlert.isVisible = false;
    this.newRegister = false;
    this.selected = this.initialData;
    this.areErrors = false;
    Object.keys(this.errors).forEach((key: string) => {
      this.errors[key] = '';
    });
  }
}
