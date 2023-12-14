import { FormTitle } from "../interfaces/allTypes";

export const FORM_TITLES: FormTitle = {
  add:'Agregar',
  edit: 'Editar',
  none: ''
}

export const INITIAL_DRIVER_DATA = {
  dni: '',
  name: '',
  surname: '',
  type: ''
 }

 export const INITIAL_VEHICLE_DATA = {
  id: 0,
  plate_number: '',
  access_type_id: '',
  status_type_id: '',
  vehicle_type_id: ''
}

export const MANDATORY_IF_HAVE_IDS = [1]
