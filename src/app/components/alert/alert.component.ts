import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() title: string = 'Correcto';
  @Input() message: string = 'Hecho';
  @Input() icon: string = 'done';
  @Output() agree = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  cancelId: string = 'alert-btn-cancel'
  modalId: string = 'alert-component'
  onAcept() {
    this.agree.emit();
  }

  onCancel(event:any) {
    const isModal = event.target.id === this.modalId
    const isBtn = event.target.id === this.cancelId
    if(isBtn || isModal){
      this.cancel.emit();
    }
  }
}
