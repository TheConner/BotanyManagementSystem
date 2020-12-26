import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Environment } from 'src/app/model/environment.model';
import { Image } from 'src/app/model/Image.model';
import { Sensor } from 'src/app/model/sensor.model';
import { formatDate } from "@angular/common";
import { BMSService } from 'src/app/service/bms.service';
import { HotTableComponent } from '@handsontable/angular';


@Component({
  selector: 'app-reading-table',
  templateUrl: './reading-table.component.html',
  styleUrls: ['./reading-table.component.css']
})
export class ReadingTableComponent implements OnInit {
  @Input('environment') environment: Environment; 
  @ViewChild("hot", { static: false }) hot: HotTableComponent;

  public sensDataTable: any[] = [];
  public settings: any = {
      licenseKey: 'non-commercial-and-evaluation',
      outsideClickDeselects: false,
      columns: [],
      colHeaders: [],
      columnSorting: {
        initialConfig: {
          column: 0,
          sortOrder: 'desc'
        }
      }
  };
  public nextPage: Number = null;


  constructor(private api: BMSService) { }

  ngOnInit(): void {

    let sensorIds = this.environment.sensors.map(s => s.id);
    // Set up our table configuration:
    this.settings.columns = [
      {
        data: 'taken_on',
        type: "text",
        sortFunction: function(sortOrder) {
          return function(a, b) {
            let date_a = new Date(a);
            let date_b = new Date(b);
            return (date_a == date_b) ? 0 : (date_a < date_b) ? 1 : -1;
          }
        }
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
      this.nextPage = readingTable["pagination_prev_id"];
      for (let i in readingTable.data) {
        readingTable.data[i]['taken_on'] = formatDate(readingTable.data[i]['taken_on'],'medium','en-US');
        this.sensDataTable.push(readingTable.data[i]);
      }
      this.hot.updateHotTable(this.settings);
    });
  }

  LoadNextPage() {
    console.log("Loading Next Page")
    let sensorIds = this.environment.sensors.map(s => s.id);
    // Fetch sensor reading data, as a table:
    this.api.getReadingsAsTable(sensorIds, 10, this.nextPage)
    .subscribe((readingTable: any) => {
      this.nextPage = readingTable["pagination_prev_id"]
      for (let i in readingTable.data) {
        readingTable.data[i]['taken_on'] = formatDate(readingTable.data[i]['taken_on'],'medium','en-US');
        this.sensDataTable.push(readingTable.data[i]);
      }
      this.hot.updateHotTable(this.settings);
    });
  }

}