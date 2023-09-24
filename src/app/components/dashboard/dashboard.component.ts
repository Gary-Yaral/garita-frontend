import { Component, OnInit } from '@angular/core';
import { NavStatusService } from 'src/app/services/nav-status.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  constructor(private navStatus: NavStatusService) {

  }
  ngOnInit() {
  }

}
