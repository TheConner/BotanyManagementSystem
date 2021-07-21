import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCalculator, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Plant } from 'src/app/model/Plant.model';
import { BMSService } from 'src/app/service/bms.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent implements OnInit {
  plant: Plant;
  faCalculator = faCalculator;
  faDollar = faDollarSign;

  constructor(private route: ActivatedRoute,
    private api: BMSService) { }

  ngOnInit(): void {
    let plantID = parseInt(this.route.snapshot.paramMap.get('id'));

    this.api.getPlant(plantID)
    .subscribe((data) => {
      this.plant = data;
    })
  }

}
