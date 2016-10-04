import { Component, Input,OnInit, OnChanges} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import {groupBy} from '../../pipes/comon';
import {Paramsdata} from '../../providers/params-data/params-data';
import {Simu} from '../../providers/simu/simu';

/*
  Generated class for the FlexInput component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'flex-display',
  templateUrl: 'flex-display.html',
})
export class FlexDisplay implements OnInit, OnChanges {
  menuCurrent: any = {};
  dataCurrent: any;
  okForm: boolean = false;
  form: any;
  selectedForm: any = null;
  selectedFields: any = null;
  dataNonInput: any = {};     // data added outside the generic form
  popupWindow: any = null;    // windows object, open for simulation
  simuExec: boolean = false;  // flag for exec simulation 
  @Input() idPageIn: any;
  @Input() idForm: any;
  @Input() dataIn: any;
  @Input() idClient: any;
  @Input() formTitle: any;
  constructor(public platform: Platform, public paramsApi: Paramsdata, public simu: Simu, public events: Events) {

  }
  ngOnInit() {
    //console.log("==> Data passed to component : ", this.idPageIn, this.idForm, this.dataIn, this.idClient);

  };
  ngOnChanges(changes: any) {
    //console.log("Data Changes", changes);
    this.idClient = changes.idClient.currentValue;
    if (changes['dataIn']) {
      this.dataCurrent = changes.dataIn.currentValue;
    } else {
      this.dataCurrent = this.dataIn;
    }
    this.loadForm(this.idForm, this.idClient, this.dataCurrent).then(response => {
      //console.log("==> Form Display change", response);
      if (this.formTitle == "") this.formTitle = this.selectedForm['title'];
      this.selectedFields = new groupBy().transform(response['formInput'], 'group');
      this.okForm = true;
    }, error => {
      this.okForm = false;
    });

  };
  /* ======================================================================
  * Create a form component with 
  *    - all fields parameters and validation control
  *    - default value , initialized from the synchronised folder
  * ======================================================================= */
  loadForm(idForm, idClient, data) {
    return new Promise((resolve, reject) => {
      //console.log("Data to display", idForm, idClient, data);
      let dataForm = data['rdv']['resultByClient'][idClient]['forms'];
      let ret={};
      dataForm.forEach((elt, key) => {
        if (key == idForm) {ret=elt;}
      });
      resolve(ret);
    });
  }

  // Validation form
  diagNext(formStatus, evt) {
    //console.log("Save data form", this.form.controls, this.selectedForm['fields']);
    //console.log("Click event",evt);
    this.menuCurrent.status = formStatus;
    let fForm = [];
    for (var key in this.form.controls) {
      let question = this.form.controls[key];
      let field = this.selectedForm['fields'].filter(item => item.model === key);
      fForm.push({
        model: key,
        field: field[0]['title'],
        error: question['_errors'],
        pristine: question['_pristine'],
        status: question['_status'],
        touched: question['_touched'],
        value: question['_value']
      });
    }
    let dForm = { "form": this.selectedForm['title'], "status": formStatus, "formInput": fForm, "extraData": this.dataNonInput };
    this.dataIn['rdv']['resultByClient'][this.idClient]['forms'][this.selectedForm.id] = dForm;
    if (this.simuExec) {
      this.simu.getSimu(this.dataNonInput['idSimu']).then(data => {
        //console.log("GET SIMU DATA", data);
        this.dataNonInput['simu'] = data['results']['output'][0];
        dForm['extraData'] = this.dataNonInput;
        this.dataIn['rdv']['resultByClient'][this.idClient]['forms'][this.selectedForm.id] = dForm;
        this.events.publish('rdvSave', this.dataIn);
      }, error => {
        console.log(error);
      })
    } else {
      this.events.publish('rdvSave', this.dataIn);
    }
    this.events.publish('rdvStatus_' + this.idPageIn, { idPage: this.idPageIn, form: this.selectedForm, status: formStatus });
  }
  // ===== External Simulator with params ====
  openSimu(url) {
    //console.log("Open url", url);
    window.open(url, "_system");
    /*
    var options = {'location': 'yes','clearcache': 'yes','toolbar': 'yes'};
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open(url, "_system", options);
    });
    */
  }
  openSimuData(idx, field, url) {
    let me = this;
    //console.log("OPEN SIMU WITH DATA:", idx, field, url);
    let rdvId = this.dataCurrent['rdv']['rdvId'];
    this.simu.callSimu({ "rdvId": rdvId, "dataIn": this.dataCurrent }).then(data => {
      //console.log("Data from simu",data)
      me.simuExec = true;
      url = data['urlNext'];
      me.dataNonInput['idSimu'] = data['insert_id'];
      //let idField = idx;
      let options = "location=yes,clearcache=yes,toolbar=yes,width=800,height=600";
      if (this.popupWindow && !this.popupWindow.closed) {
        this.popupWindow.doRefresh();
      } else {
        this.popupWindow = window.open(url, "SIMU", options);
        this.popupWindow.focus();
      }
      me.events.publish("simuStart", data, this.popupWindow);
    }, error => {
      console.log(error);
      me.simuExec = false;
    });
  }
}
