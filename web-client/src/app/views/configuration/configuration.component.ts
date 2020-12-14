import { Component, OnInit } from '@angular/core';
import { BMSService } from 'src/app/service/bms.service';
import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  private hotRegisterer = new HotTableRegisterer();
  public envData: any[];
  public sensData: any[];
  public settings = {
      licenseKey: 'non-commercial-and-evaluation',
      fillHandle: false,
      outsideClickDeselects: false,
      disableVisualSelection: true
  }
  private envTable = "environments";
  private sensTable = "sensors";

  sensorForm: FormGroup;

  constructor(private api: BMSService, private toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.refreshConfig();
    this.sensorForm = new FormGroup({
      envSelection: new FormControl('', Validators.required),
      sensName: new FormControl('', Validators.required),
      sensDesc: new FormControl('', Validators.required)
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

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log('Modal closed')
      let val = this.sensorForm.value;
      this.api.addSensor(val['envSelection'], val['sensName'], val['sensDesc'])
      .subscribe(
        result=>{
          this.toastr.success('Added new sensor');
          this.refreshConfig();
        },
        error => {
          this.toastr.error('Error adding sensor: ' + error.error.text)
        }
      )
    }, (reason) => {
      console.log('Modal Closed' + reason)
    });
  }

  /// Env stuff
  public addEnv() {
    this.api.addEnvironment()
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
    let selected = this.hotRegisterer.getInstance('envTable').getSelected();

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
    }

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
