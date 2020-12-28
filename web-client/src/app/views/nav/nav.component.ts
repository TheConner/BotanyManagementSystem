import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BMSService } from 'src/app/service/bms.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public user: any;
  constructor(private api: BMSService) { }

  ngOnInit(): void {
    this.api.getUser()
    .subscribe((user) => {
      this.user = user;
    })
  }

}
