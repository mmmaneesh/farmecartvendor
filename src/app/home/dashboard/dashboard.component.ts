import { Component, OnInit } from '@angular/core';
import { NavigatorService } from '../../../jApp/navigator.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(public navigator: NavigatorService) { }

  ngOnInit() {}

}
