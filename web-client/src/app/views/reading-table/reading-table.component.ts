import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Environment } from 'src/app/model/environment.model';
import { formatDate } from "@angular/common";
import { BMSService } from 'src/app/service/bms.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-reading-table',
  templateUrl: './reading-table.component.html',
  styleUrls: ['./reading-table.component.css']
})
export class ReadingTableComponent implements OnInit {
  @Input('environment') environment: Environment; 
  
  public sensDataTable: any[] = [];
  public settings: any = {
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

  public index: number;
  public pageSize: number = 20;
  public pages: Array<any>;
  public count: number;

  constructor(private api: BMSService) { }

  ngOnInit(): void {
    this.index = 0;
    this.pages = [null];
    // Set up our table configuration:
    this.settings.columns = [
      {
        data: 'taken_on',
        th: true,
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

    this.Load(null, this.index+1);
  }

  private Load(page, index, ignoreNext=false) {
    console.log("Load " + page + "  index " + index )
    let sensorIds = this.environment.sensors.map(s => s.id);
    this.api.getReadingsAsTable(sensorIds, this.pageSize, page)
      .subscribe((readingTable: any) => {
        this.sensDataTable = [];
        for (let i in readingTable.data) {
          readingTable.data[i]['taken_on'] = formatDate(readingTable.data[i]['taken_on'],'medium','en-US');
          this.sensDataTable.push(readingTable.data[i]);
        }
        this.sensDataTable.reverse()
        if (!ignoreNext) {
          // If we don't already have the next page
          if (!this.pages.includes(readingTable["pagination_prev_id"])) {
            // Add it
            this.pages.push(readingTable["pagination_prev_id"])
          }
        }
        this.count = readingTable["count"];
        console.log(this.pages);
      });
  }

  LoadNextPage() {
    this.index++;
    let nextPage = this.pages[this.index];
    this.Load(nextPage, this.index);
  }

  LoadPrevPage() {
    this.index--;
    let lastPage = this.pages[this.index];
    this.Load(lastPage, this.index, true);
  }

  OnCountChange(newValue) {
    // Changing the page size resets the position
    this.index = 0;
    this.pages = [null];

    this.pageSize = newValue*this.environment.sensors.length;
    this.Load(null, this.index+1);
  }
}
