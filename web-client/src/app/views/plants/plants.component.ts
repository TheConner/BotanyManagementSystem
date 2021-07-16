import { Component, OnInit } from '@angular/core';
import { Plant } from 'src/app/model/Plant.model';
import { BMSService } from 'src/app/service/bms.service';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrls: ['./plants.component.css']
})
export class PlantsComponent implements OnInit {
  public plants: Plant[];

  constructor(private api: BMSService) { }

  ngOnInit(): void {
    this.api.getPlants()
    .subscribe((data: Plant[]) => this.plants = data);
  }

}
