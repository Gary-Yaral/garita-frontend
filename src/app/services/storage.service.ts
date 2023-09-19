import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storageKey: string = "secure_controls"
  constructor() { }

  storageExists() {
    const storage = localStorage.getItem(this.storageKey)
    if(storage) {
      const data = JSON.parse(storage)
      if(data.token){
        return true
      }
    }
    return false
  }

  getStorage() {
    const storage = localStorage.getItem(this.storageKey)
    if(storage) {
      return JSON.parse(storage)
    } else {
      return undefined
    }
  }

  setStorage(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  cleanStorage() {
    localStorage.removeItem(this.storageKey)
  }
}
