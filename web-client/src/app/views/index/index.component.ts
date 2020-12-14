import { Component, OnInit } from '@angular/core';
import { Environment } from 'src/app/model/environment.model';
import { BMSService } from 'src/app/service/bms.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public environments : Environment[];
  constructor(private api:  BMSService) { }

  ngOnInit(): void {
    this.api.getEnvironments()
    .subscribe((data: Environment[]) => this.environments = data);
  }

}
