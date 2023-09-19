import { Component } from '@angular/core';
import { CAMERA_PATH } from 'src/app/config/constants';
import { FloatNavbarComponent } from '../float-navbar/float-navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  lifeUrl: string = CAMERA_PATH
  constructor() {

  }

  showVideo() {
    this.lifeUrl = CAMERA_PATH
  }

  hideVideo() {
    this.lifeUrl = '../../../assets/img/security_camera.jpg'
  }
}
