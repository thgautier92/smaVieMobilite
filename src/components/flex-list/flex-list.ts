import { Component, Input} from '@angular/core';
import {Platform, ViewController,ModalController, NavController, Events, NavParams} from 'ionic-angular';
import { FormBuilder} from '@angular/forms';
import {groupBy} from '../../pipes/comon';
import {Paramsdata} from '../../providers/params-data/params-data';

/*
  Generated class for the FlexList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'flex-list',
  templateUrl: 'flex-list.html',
})
export class FlexList {
  menuCurrent: any = {};
  list: any = [];
  form: any;
  addedForm: boolean = false;
  selectedForm: any = null;
  selectedFields: any;
  @Input() idPageIn: any;
  @Input() idForm: any;
  @Input() dataIn: any;
  @Input() idClient: any;
  @Input() formTitle: any;
  constructor(public viewCtrl: ViewController, public nav: NavController,public modalCtrl: ModalController, public platform: Platform, public fb: FormBuilder, public paramsApi: Paramsdata, public events: Events) {
  }
  ngOnInit() {
    //console.log("!! Data passed to component : ", this.idPageIn, this.idForm, this.dataIn, this.idClient);
    this.list = [];
  };
  addItem() {
    let modal = this.modalCtrl.create(FlexDetail, { "idForm": this.idForm });
    modal.onDidDismiss(data => {
      if (data) {
        this.selectedForm = data['form'];
        if(this.formTitle=="") this.formTitle=this.selectedForm['title'];
        this.list.push(data['value']);
        this.addedForm = true;
      }
    });
    modal.present();
  }
  removeItem(idx) {
    this.list.splice(idx, 1);
  }
  diagNext(formStatus, evt) {
    //console.log("Save data form", this.form, this.selectedForm);
    //console.log("Click event",evt);
    this.menuCurrent.status = formStatus;
    let dForm = { "form": this.selectedForm['title'], "status": formStatus, "formInput": this.list };
    this.dataIn['rdv']['resultByClient'][this.idClient]['forms'][this.idForm] = dForm;
    this.events.publish('rdvSave', this.dataIn);
    this.events.publish('rdvStatus_' + this.idPageIn, { idPage: this.idPageIn, form: this.selectedForm, status: formStatus });
  }
}

@Component({
  templateUrl: 'flex-detail.html',
})
export class FlexDetail {
  idForm: any;
  formDetail: any;
  selectedForm: any;
  selectedFields: any = null;
  constructor(public viewCtrl: ViewController, public platform: Platform, public fb: FormBuilder, public navParams: NavParams, public paramsApi: Paramsdata, public events: Events) {
    this.formDetail = this.fb.group({});
    //console.log(navParams);
    this.idForm = navParams.data['idForm'];
  }
  ngOnInit() {
    //console.log("Form readed", this.idForm);
    this.paramsApi.getForm(this.idForm).then(data => {
      //console.log("==> Return form params ", this.idForm, data);
      this.formDetail = data['formGroup'];
      this.selectedForm = data['form'];
      // Group fields array
      this.selectedFields = new groupBy().transform(this.selectedForm['fields'], 'group');
      //console.log("Display form", this.selectedForm, this.form, this.selectedFields)
    }, error => {
      console.error("Impossible de lire le formulaire", this.idForm);
      console.error(error);
    });
  }
  saveData() {
    //console.log(this.formDetail);
    this.viewCtrl.dismiss({ "form": this.selectedForm, "value": this.formDetail['_value'] });
  }
  close() {
    this.viewCtrl.dismiss(null);
  }
}
