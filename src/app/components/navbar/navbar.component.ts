import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLES, SYSTEM_NAME, VIEWS } from 'src/app/config/constants';
import { pathObject } from 'src/app/interfaces/path';
import { NavStatusService } from 'src/app/services/nav-status.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  sysName:string = SYSTEM_NAME
  views: pathObject[] = VIEWS
  visible: boolean = false
  isAdmin: boolean = false
  isSuperAdmin: boolean = false
  constructor(
    private navStatus: NavStatusService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.navStatus.isVisible$.subscribe(status => {
      this.visible = status;
    });

     this.isAdmin = this.storageService.rolExists(ROLES.ADMINISTRATOR)
     this.isSuperAdmin = this.storageService.rolExists(ROLES.SUPER)
  }

  openClose() {
     if(this.visible) {
      this.navStatus.setVisible(false)
    } else {
      this.navStatus.setVisible(true)
    }
  }

  closeSession() {
    this.storageService.cleanStorage()
    this.router.navigate(['/login'])
  }
}
