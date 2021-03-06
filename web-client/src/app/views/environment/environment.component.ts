import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Environment } from 'src/app/model/environment.model';
import { Image } from 'src/app/model/Image.model';
import { Sensor } from 'src/app/model/sensor.model';
import { BMSService } from 'src/app/service/bms.service';
import { formatDate } from "@angular/common";
import { AuthService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent implements OnInit {
  constructor(private route:ActivatedRoute, private api: BMSService, private auth: AuthService) { }
  public environment: Environment;
  public images: Image[];
  public CurrentTab: string;
  public Tabs: string[] = ["Graphs", "Data", "Media", "Notes"];

  ngOnInit(): void {
    this.CurrentTab = this.Tabs[0];
    let env = parseInt(this.route.snapshot.paramMap.get('env'));
    this.api.getEnvironment(env)
    .subscribe((data: Environment)=> {
      this.environment = data;
    });

    this.api.getImages(env)
    .subscribe((data) => {
      this.images = data;
    });
  }

  SetTab(newTab: string) {
    this.CurrentTab = newTab;
  }
}
