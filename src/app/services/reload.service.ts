import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CHANGES_TYPE, REGISTER_FORM_TYPES } from '../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  // Propiedad para manejar cambios en la tabla común
  private hadChanged: BehaviorSubject<any> = new BehaviorSubject<any>({
    changed: false,
    type: CHANGES_TYPE.ADD
  });
  public hadChanged$: Observable<any> = this.hadChanged.asObservable();

  // Propiedad para manejar si se guardan o no los datos del nuevo registro
  private dataSaved: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public dataSaved$: Observable<any> = this.dataSaved.asObservable();

  // Propiedad para detectar que tipos de action hará el formulario
  private formActions: BehaviorSubject<any> = new BehaviorSubject<any>({
    show: false,
    type: REGISTER_FORM_TYPES.ADD,
    data: {id:0}
  });
  public formActions$: Observable<any> = this.formActions.asObservable();
  constructor() { }

  addChanges(newValue: any): void {
    this.hadChanged.next(newValue);
  }

  wasSaved(newValue: any): void {
    this.dataSaved.next(newValue);
  }

  setFormAction(newValue: any): void {
    this.formActions.next(newValue);
  }

}
