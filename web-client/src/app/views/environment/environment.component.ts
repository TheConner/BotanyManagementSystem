import { Component, OnInit } from '@angular/core';
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
  
  public sensDataTable: any[];
  public settings = {
      licenseKey: 'non-commercial-and-evaluation',
      outsideClickDeselects: false,
      multiColumnSorting:true,
      columns: [],
      colHeaders: []
  }

  ngOnInit(): void {
    let env = parseInt(this.route.snapshot.paramMap.get('env'));
    this.api.getEnvironment(env)
    .subscribe((data: Environment)=> {
      this.environment = data;
      this.initTable();
    });

    this.api.getImages(env)
    .subscribe((data) => {
      this.images = data;
    })
  }

  private initTable() {
    let sensorIds = this.environment.sensors.map(s => s.id);
    // Set up our table configuration:
    this.settings.columns = [
      {
        data: 'taken_on',
        type: "text"
      }
    ];

    this.settings.colHeaders = ["Reading Date"];
    
    this.environment.sensors.forEach(sensor => {
      this.settings.columns.push({
        data: sensor.id,
        type: "numeric"
      });
      this.settings.colHeaders.push(sensor.name);
    });

    // Fetch sensor reading data, as a table:
    this.api.getReadingsAsTable(sensorIds, 10)
    .subscribe((readingTable: any) => {
      for (let i in readingTable) {
        readingTable[i]['taken_on'] = formatDate(readingTable[i]['taken_on'],'medium','en-US');
      }
      this.sensDataTable = readingTable;
    });
  }

}
