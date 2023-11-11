export interface dinamicKey {
  [key: string]:string,
}

export interface UserData {
  id: string | number,
  name: string,
  surname: string,
  dni: string
}

export interface Vehicle {
  id?: number,
  plate_number: string,
  access_type_id?: number,
  access_type_name?: string,
  status_type_id?: number,
  status_type_name?: string,
  vehicle_type_id?: number,
  vehicle_type_name?: string,
}

export interface Driver {
  id?: Number,
  dni: String,
  surname: String,
  name: String,
  type_id?: Number,
  type: String
}

export type DriverType = {
  id: number,
  name: string
}

export interface FormDataStorage {
  vehicle: Vehicle,
  exists: boolean
}

export type driverKey = keyof Driver;
