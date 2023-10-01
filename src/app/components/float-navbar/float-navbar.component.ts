import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROLES, SYSTEM_NAME, VIEWS } from 'src/app/config/constants';
import { UserData } from 'src/app/interfaces/allTypes';
import { pathObject } from 'src/app/interfaces/path';
import { NavStatusService } from 'src/app/services/nav-status.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-float-navbar',
  templateUrl: './float-navbar.component.html',
  styleUrls: ['./float-navbar.component.css']
})
export class FloatNavbarComponent {
  user: UserData = {
    id: 0,
    name: "",
    surname: "",
    dni: ""
  }
  sysName: string = SYSTEM_NAME
  views: pathObject[] = VIEWS
  visible: boolean = false
  isAdmin: boolean = false
  isSuperAdmin: boolean = false
  constructor(
    private navStatus: NavStatusService,
    private storageService: StorageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    // Escuchamos el evento cuando sea visible o no el nav flotante
    this.navStatus.isVisible$.subscribe(status => {
      this.visible = status;
    });
    // Verificamos si tiene rol administrador
    this.isAdmin = this.storageService.rolExists(ROLES.ADMINISTRATOR)
    // Verificamos si tiene rol administrador
    this.isSuperAdmin = this.storageService.rolExists(ROLES.SUPER)
    // Obtenemos los datos del usuario logueado
    this.getUserData()
  }

  getUserData() {
    if(this.storageService.userExists()) {
      this.user = this.storageService.getUser()
    }
  }

  closeSession() {
    this.storageService.cleanStorage()
    this.router.navigate(['/login'])
  }
}
