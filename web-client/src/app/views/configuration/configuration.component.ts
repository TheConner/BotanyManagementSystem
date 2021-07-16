import { Component, OnInit } from '@angular/core';
import { BMSService } from 'src/app/service/bms.service';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Sensor } from 'src/app/model/sensor.model';
import { Environment } from 'src/app/model/environment.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  public envData: any[];
  public sensData: any[];
  private envTable = "environments";
  private sensTable = "sensors";
  public sensorModalObj: Sensor;

  sensorForm: FormGroup;
  environmentForm: FormGroup;

  constructor(private api: BMSService, private toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.refreshConfig();
    this.sensorForm = new FormGroup({
      environment: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      ui_color: new FormControl('', Validators.required)
    });

    this.environmentForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  private refreshConfig() {
    this.api.getConfiguration()
    .subscribe((data:any) => {
      this.envData = data[0].sort(this.sortHelper);
      this.sensData = data[1].sort(this.sortHelper);
    });
  }

  private sortHelper(a,b) {
    return a.id > b.id
  }

  
  SensorModal(content, sensor) {
    if (sensor != null) this.sensorForm.patchValue(sensor);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result) => {
      console.log('Modal closed')
      let val = this.sensorForm.value;
      console.log(val);

      if (sensor == null) {
        // We are adding new
        let s = new Sensor();
        s.environment = val['environment'];
        s.name = val['name'];
        s.description = val['description'];
        s.ui_color = val['ui_color'];
        this.api.addSensor(s)
        .subscribe(
          result=>{
            this.toastr.success('Added new sensor');
            this.refreshConfig();
          },
          error => {
            this.toastr.error('Error adding sensor: ' + error.error.text)
          }
        )
      } else {
        let id = this.sensData.findIndex(s => s.id == sensor.id);
        this.sensData[id] = Object.assign(this.sensData[id], val);
        console.log(this.sensData)
        this.saveSens();
      }

    }, (reason) => {
      console.log('Modal Closed' + reason)
    });
  }

  EnvironmentModal(content, environment) {
    if (environment != null) this.environmentForm.patchValue(environment);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result) => {
      console.log('Modal closed')
      let val = this.environmentForm.value;

      if (environment == null) {
        // We are adding new
        console.log("Add new environment", val);
        let environment = new Environment();
        environment.name = val.name;
        environment.description = val.description;
        this.addEnv(environment);
      } else {
        console.log("Update existing environment", val);
        let id = this.envData.findIndex(e => e.id == environment.id);
        this.envData[id] = Object.assign(this.envData[id], val);
      }

    }, (reason) => {
      console.log('Modal Closed' + reason)
    });
  }

  /// Env stuff
  public addEnv(e: Environment) {
    this.api.addEnvironment(e)
    .subscribe((data:any) => {
      this.refreshConfig();
    } )
  }

  public saveEnvs() {
    console.log(this.envData)
    this.api.setConfiguration(this.envTable, this.envData)
    .subscribe((res: any) => {
        this.envData = res.sort(this.sortHelper);
        this.toastr.success('Environments updated!')
    },
    error => {
      console.log(error)
      this.toastr.error('ERROR: server says: ' + error.error.text)
    })
  }

  public delEnv() {
/*    let selected;

    if (selected == null) {
      this.toastr.warning("To delete a record, select any cell in the row of that record then click delete");
    } else {
      let selectedRow = selected[0][0] // drill down to the row number
      // Get the ID of what we want to delete
      let deletionId = this.envData[selectedRow].id
      this.api.delEnvironment(deletionId)
      .subscribe((d) => {
        console.log(d);
        this.refreshConfig();
      })
    }*/

  }

  /// Sensor Stuff

  public addSens() {
  }

  public saveSens() {
    this.api.setConfiguration(this.sensTable, this.sensData)
    .subscribe((res: any) => {
        this.sensData = res.sort(this.sortHelper);
        this.toastr.success('Sensors updated!')
    },
    error => {
      console.log(error)
      this.toastr.error('ERROR: server says: ' + error.error.text)
    })
  }
}
