import { Component, OnInit } from '@angular/core';
import { concat } from 'rxjs';
import { CAMERA_PATH, ROUTES_API } from 'src/app/config/constants';
import { HomeData } from 'src/app/interfaces/allTypes';
import { ChangeDateService } from 'src/app/services/change-date.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lifeUrl: string = CAMERA_PATH
  arrivalData: HomeData[] = []
  exitData: HomeData[] = []

  constructor(
    private restApi: RestApiService,
    private changeDate: ChangeDateService
  ) {}

  ngOnInit(): void {
    this.doRequests()
    this.changeDate.detectChange(() => this.doRequests())
  }

  showVideo() {
    this.lifeUrl = CAMERA_PATH
  }

  hideVideo() {
    this.lifeUrl = '../../../assets/img/security_camera.jpg'
  }

  doRequests() {
    let result: any[] = []
    concat(this.restApi.doGet(`${ROUTES_API.register}/home-arrival-data`), this.restApi.doGet(`${ROUTES_API.register}/home-exit-data`)).subscribe((data:any) => {
      if(data.result[0]) {
        result.push(data.result[1])
      }

      if(result.length === 2) {
        this.arrivalData = result[0]
        this.exitData = result[1]
      }
    });
  }
}
