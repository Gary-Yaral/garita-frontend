import { Component, OnInit } from '@angular/core';
import { ROUTES_API, SYSTEM_NAME } from 'src/app/config/constants';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  sysName: string = SYSTEM_NAME
  constructor(
    private restApi: RestApiService,
    private storageService: StorageService
  ) {

  }
  ngOnInit(): void {
    this.sendData()
  }

  sendData() {
    this.restApi.doPost(ROUTES_API.access, {username:"", password:""}).subscribe((data:any) => {
      if(data.access) {
        this.storageService.setStorage(data.info)
      }
    })
  }

}
