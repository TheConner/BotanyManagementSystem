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
  MODE_LIGHT: string = 'litera';
  MODE_DARK: string = 'darkly';
  public CurrentMode: string = this.MODE_LIGHT;

  constructor(private api: BMSService, private renderer: Renderer2) {
    // immediately switch theme
    // TODO: refactor into a themes service that can be used between this and the theme switcher in nav
    if (window.localStorage.getItem('theme') != null) {
      this.SetMode(window.localStorage.getItem('theme'))
    }
   }

  ngOnInit(): void {
    this.api.getUser()
    .subscribe((user) => {
      this.user = user;
    })
  }

  SetMode(mode) {
    this.CurrentMode = mode;
    window.localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('theme', mode)
  }

}
