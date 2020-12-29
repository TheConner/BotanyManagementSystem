import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BMSService } from 'src/app/service/bms.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public user: any;
  public CurrentMode: string = '';
  constructor(private api: BMSService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.api.getUser()
    .subscribe((user) => {
      this.user = user;
    })
  }

  SetMode(mode) {
    this.CurrentMode = mode;
    this.renderer.setAttribute(document.documentElement, 'theme', mode);
  }

}
