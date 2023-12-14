import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CHANGES_TYPE } from '../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private hadChanged: BehaviorSubject<any> = new BehaviorSubject<any>({
    changed: false,
    type: CHANGES_TYPE.ADD
  });
  public hadChanged$: Observable<any> = this.hadChanged.asObservable();

  private dataSaved: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public dataSaved$: Observable<any> = this.dataSaved.asObservable();

  constructor() { }

  addChanges(newValue: any): void {
    this.hadChanged.next(newValue);
  }

  wasSaved(newValue: any): void {
    this.dataSaved.next(newValue);
  }

  reset() {
    this.addChanges({changed: false, type: CHANGES_TYPE.ADD})
  }
}
