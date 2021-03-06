import { Component } from '@angular/core';
import {Platform, NavController,} from 'ionic-angular';
import {groupBy} from '../../pipes/comon';
import { CouchDbServices } from '../../providers/couch/couch';
import {DisplayTools} from '../../providers/comon/display';
import { RdvPage } from '../rdv/rdv';

declare var PouchDB: any;
/*
  Generated class for the StartPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'start.html',
})
export class StartPage {
  platform: any;
  srvInfo: any;
  userData: any;
  base: any;
  db: any;
  docs: any;
  params: any;
  display: DisplayTools;
  constructor(public nav: NavController, platform: Platform, display: DisplayTools, public couch: CouchDbServices) {
    this.platform = platform;
    this.display = display;
    this.params = couch.getParams();
    //console.log(this.params);
    this.docs = [];
  }
  ngOnInit() {
    this.couch.verifSession(true).then(response => {
      this.userData = response;
      this.base = this.userData['name'].toLowerCase();
      this.loadBase(this.base);
    }, error => {
      console.error(error);
      this.userData = null;
      this.base = 'demo';
      this.display.displayToast("Veuillez vous identifier ! Mode démo activé");
      this.loadBase(this.base);
    });
  }
  loadBase(base) {
    let loading = this.display.displayLoading("Activation de la base " + base, 1);
    this.db = new PouchDB(base);
    this.docs = []
    this.showBase();
    loading.dismiss();
  }
  showBase(status?) {
    let me = this;
    me.docs = [];
    this.db.allDocs({ include_docs: true, descending: true }, function (err, data) {
      //console.log(data);
      if (status) {
        let dataFilter = data.rows.filter(item => item.doc.rdv.status === status);
        console.log("Filter",dataFilter);
        me.docs = new groupBy().transform(dataFilter, 'doc', 'rdv', 'dateRdv', 10);
      } else {
        me.docs = new groupBy().transform(data.rows, 'doc', 'rdv', 'dateRdv', 10);
      }
      //console.log("RDV Doc group by date",me.docs);
    });
  };
  start(item) {
    // start the RDV with data
    //console.log("Start RDV with item ", item);
    item['doc']['rdvEnded'] = false;
    this.nav.setRoot(RdvPage, { base: this.base, rdvId: item.id });
  }
}
