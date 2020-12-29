import { Component, Input, OnInit } from '@angular/core';
import { Sensor } from 'src/app/model/sensor.model';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BMSService } from 'src/app/service/bms.service';
import { Reading } from 'src/app/model/reading.model';
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {
  @Input() sensor: Sensor;
  public reading: Reading;
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartColors: Color[] = [];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  
  private readingCount:Number;
  private defaultLineColor = {
    borderColor: 'black',
    backgroundColor: 'rgba(255,0,0,0.3)',
  };
  public loading: boolean = true;

  constructor(private api: BMSService) { }

  ngOnInit(): void {
    this.readingCount=10;
    this.RefreshData();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
  
  private hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}


  private RefreshData() {
    this.api.getReading(this.sensor.id, this.readingCount)
    .subscribe((data) => {
      this.reading = data[this.sensor.id.toString()];
      this.lineChartData = [];
      this.lineChartLabels = [];
      if (this.sensor.ui_color == null) {
        this.lineChartColors.push(this.defaultLineColor);
      } else {
        this.lineChartColors.push({
          borderColor: this.defaultLineColor.borderColor,
          backgroundColor: this.hexToRGB(this.sensor.ui_color, "0.3")
        });
      }

      this.lineChartData.push({
        data: this.reading.value,
        label: this.sensor.name.toString()
      });
      this.lineChartLabels = this.reading.taken_on.map((m) => formatDate(m,'medium','en-US'));
    });
  }

  public OnCountChange(value) {
    this.readingCount=value;
    this.RefreshData();
  }
}
