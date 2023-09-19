import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  currentUser: any = {
    data: {
      username: "",
      roles: []
    },
    token: ""
  }

  constructor(
    private storageService: StorageService,
    private http: HttpClient
  ) {
  }

  private loadDataRequest() {
    if(this.storageService.storageExists()){
      const session = this.storageService.getStorage()
      if(session) {
        try {
          this.currentUser = session
        } catch (error) {
          console.log("Loaded data is not valid");
        }
      }
    }
  }

  public doPost(url: string, data: any) {
    this.loadDataRequest()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.currentUser.token
    });
    return this.http.post(url, data, {headers});
  }

  public doGet(url: string) {
    this.loadDataRequest()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.currentUser.token
    });
    return this.http.get(url, {headers});
  }

  public doPut(url: string, data: any){
    this.loadDataRequest()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.currentUser.token
    });
    return this.http.put(url, data,{headers});
  }

  public doDelete(url: string){
    this.loadDataRequest()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.currentUser.token
    });
    return this.http.delete(url, {headers});
  }
}
