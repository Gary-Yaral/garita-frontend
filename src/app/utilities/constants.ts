import { FormTitle, ModalProps } from "../interfaces/allTypes";

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

export const CHANGES_TYPE = {
  ADD: 1,
  UPDATE: 2,
  DELETE: 3
}

export const REGISTER_FORM_TYPES = {
  ADD: 1,
  UPDATE: 2,
  DETECTED: 3,
  NULL: 4
}

export const MANDATORY_IF_HAVE_IDS = [1]

export const DEFAULT_DATA_MODAL: ModalProps = {
  title: '',
  isVisible: false,
  message: '',
  icon: '',
  actions: {
    accept: () => {},
    cancel: () => {}
  }
}
