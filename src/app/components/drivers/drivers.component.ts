import { Component } from '@angular/core';
import { CAMERA_PATH } from 'src/app/config/constants';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent {
  lifeUrl: string = CAMERA_PATH
}
