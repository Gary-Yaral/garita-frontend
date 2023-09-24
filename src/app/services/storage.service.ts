import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/allTypes';

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

  rolExists(rol:string) {
    const storage = this.getStorage()
    if(!storage) return false
    if(!storage.data) return false
    if(!storage.data.roles) return false
    if(!Array.isArray(storage.data.roles)) return false
    return storage.data.roles.includes(rol)
  }

  userExists(): boolean {
    try {
      const storage = this.getStorage()
      const {data} = storage
      const {user} = data
      user as UserData;
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  getUser(): UserData {
      const storage = this.getStorage()
      return storage.data.user as UserData
  }

  setStorage(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  cleanStorage() {
    localStorage.removeItem(this.storageKey)
  }
}
