import { Component, OnInit } from '@angular/core';
import { CAMERA_PATH } from 'src/app/config/constants';
import { Vehicle } from 'src/app/interfaces/allTypes';
import { CameraService } from 'src/app/services/camera.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lifeUrl: string = CAMERA_PATH

  constructor(
    private socket: SocketService,
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {}

  showVideo() {
    this.lifeUrl = CAMERA_PATH
  }

  hideVideo() {
    this.lifeUrl = '../../../assets/img/security_camera.jpg'
  }
}
