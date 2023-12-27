import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChangeDateService {
  private currentDate: Date;

  constructor() {
    this.currentDate = new Date();
    this.detectChange(() =>{});
  }

  public detectChange(fn: Function): void {
    interval(60000) // Verificar cada segundo
      .pipe(
        map(() => new Date().getDate()), // Obtener el día actual
        distinctUntilChanged() // Detectar cambios en el día
      )
      .subscribe(day => {
        fn();
      });
  }
}

