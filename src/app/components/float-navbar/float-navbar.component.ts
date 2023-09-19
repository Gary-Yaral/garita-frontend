import { Component } from '@angular/core';
import { SYSTEM_NAME, VIEWS } from 'src/app/config/constants';
import { pathObject } from 'src/app/interfaces/path';
import { NavStatusService } from 'src/app/services/nav-status.service';

@Component({
  selector: 'app-float-navbar',
  templateUrl: './float-navbar.component.html',
  styleUrls: ['./float-navbar.component.css']
})
export class FloatNavbarComponent {
  sysName: string = SYSTEM_NAME
  views: pathObject[] = VIEWS
  visible: boolean = false
  constructor(private navStatus: NavStatusService) {}

  ngOnInit() {
    this.navStatus.isVisible$.subscribe(status => {
      this.visible = status;
    });
  }
}
