import { Component} from '@angular/core';
import { NavController, ViewController, NavParams, Events } from 'ionic-angular';
import {CalcTools} from '../../../providers/comon/calculate';
//import {FlexInput} from '../../../components/flex-input/flex-input';
//import {FlexDisplay} from '../../../components/flex-display/flex-display';
import {ProfilRisquePage} from "../profil-risque/profil-risque";
/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'diag-conseil.html',
})
export class DiagConseilPage {
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  dataOut: any = {};
  pageStatus: any;
  profilCalculated: any = null;
  constructor(public nav: NavController, public viewCtrl: ViewController, public params: NavParams, public events: Events, public CalcTools: CalcTools) {
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 10;
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataOut = {};
    this.lstForms = [
       { "id": 31, "title": "", "pres": "detail", "status": "" }
    ];
    // Return events from inputs forms
    this.events.subscribe('clientChange', eventData => {
      this.idClient = eventData[0]['currentCli'];
      this.dataIn = eventData[0]['currentDoc'];
      for (var key in this.lstForms) { this.lstForms[key]['status'] = ""; }
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvStatus_' + this.idPage, dataReturn => {
      //console.log("Update status form", this.lstForms, dataReturn);
      let idForm = dataReturn[0]['form']['id'];
      let f = this.lstForms.filter(item => item['id'] === idForm);
      f[0]['status'] = dataReturn[0]['status'];
      //CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('profilCalculted', dataReturn => {
      this.profilCalculated = dataReturn[0];
    })
  }
  close() {
    this.viewCtrl.dismiss();
  }
  callProfil() {
    this.nav.push(ProfilRisquePage,{"currentCli":this.idClient,"currentDoc":this.dataIn});
  }
}
