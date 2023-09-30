import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-new-register',
  templateUrl: './new-register.component.html',
  styleUrls: ['./new-register.component.css']
})
export class NewRegisterComponent {
  @Output() showForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  hideForm() {
    this.showForm.emit(false);
  }
}
