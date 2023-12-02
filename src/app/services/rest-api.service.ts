import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getExcel(url: string, data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, data, {
      headers: headers,
      responseType: 'blob',
      observe: 'response'
    });
  }

  dowloadFile(blobData: Blob, filename: string): void {
    const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
