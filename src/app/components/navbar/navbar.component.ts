import { Component, OnInit } from '@angular/core';
import { SYSTEM_NAME, VIEWS } from 'src/app/config/constants';
import { pathObject } from 'src/app/interfaces/path';
import { NavStatusService } from 'src/app/services/nav-status.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  sysName:string = SYSTEM_NAME
  views: pathObject[] = VIEWS
  visible: boolean = false
  constructor(private navStatus: NavStatusService) {
  }

  ngOnInit() {
    this.navStatus.isVisible$.subscribe(status => {
      this.visible = status;
    });
  }

  openClose() {
     if(this.visible) {
      this.navStatus.setVisible(false)
    } else {
      this.navStatus.setVisible(true)
    }
  }
}
