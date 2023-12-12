export interface dinamicKey {
  [key: string]:string,
}

export interface UserData {
  id: string | number,
  name: string,
  surname: string,
  dni: string,
  username?: string,
  password?: string,
  user_status_id?: number | string
  user_status?: boolean,
  rol_name?: string
  rol_id?: string | number
}

export interface Vehicle {
  id: number,
  plate_number: string,
  access_type_id: number | string,
  access_type_name?: string,
  status_type_id: number | string,
  status_type_name?: string,
  vehicle_type_id: number | string,
  vehicle_type_name?: string,
}

export interface VehicleType {
  id: string,
  name: string
}

export interface FilterType {
  id: string,
  name: string
}

export interface Driver {
  id?: Number,
  dni: String,
  surname: String,
  name: String,
  type_id?: Number | string,
  type: String
}

export interface DriverType {
  id: number,
  name: string
}

export interface RolType {
  id: number,
  name: string
}

export interface StatusType {
  id: number,
  name: string
}

export interface HomeData {
  name: string,
  total: number
}

export interface FormDataStorage {
  vehicle: Vehicle,
  exists: boolean
}

export interface DriverLoaded {
  dni: string,
  name: string,
  surname: string,
  type: string
}

export type formTitle = 'Agregar'| 'Editar' | ''
export interface FormTitle {
  add: formTitle,
  edit: formTitle,
  none: formTitle
}



export type driverKey = keyof Driver;
