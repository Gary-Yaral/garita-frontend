import { Component } from '@angular/core';
import { CAMERA_PATH } from 'src/app/config/constants';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  lifeUrl: string = CAMERA_PATH
  message: any = {
    plate_number: "",
    exists: false
  }
  constructor(
    private socket: SocketService
  ) {}

  ngOnInit(): void {
    this.socket.getMessage().subscribe((data: any) => {console.log(data);
    })
  }
  showVideo() {
    this.lifeUrl = CAMERA_PATH
  }

  hideVideo() {
    this.lifeUrl = '../../../assets/img/security_camera.jpg'
  }
}
