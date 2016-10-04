import { Component,  Input,  OnChanges} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import {FormBuilder} from '@angular/forms';
//import {groupBy, ValuesPipe, KeysPipe} from '../../pipes/comon';
import {Paramsdata} from '../../providers/params-data/params-data';
import {Simu} from '../../providers/simu/simu';

/*
  Generated class for the FlexInput component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'flex-radio',
  templateUrl: 'flex-radio.html',
  inputs: ['form', 'field'],
})
export class FlexRadio implements OnInit, OnChanges {

  @Input() form: any; 
  @Input() field: any;
  constructor(public platform: Platform, public fb: FormBuilder, public paramsApi: Paramsdata, public simu: Simu, public events: Events) {
  }
  ngOnInit() {
    //console.log("==> Data passed to component : ", this.form, this.field);
  };
  ngOnChanges(changes: any) {
  };
}