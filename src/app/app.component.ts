import { Component,ViewChild } from '@angular/core';
import { Platform, Events, MenuController, ModalController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { CouchDbServices } from '../providers/couch/couch';

import { HomePage } from '../pages/home/home';
import { AuthPage } from '../pages/auth/auth';
import { SynchroPage } from '../pages/synchro/synchro';
import { SignApiPage } from '../pages/sign-api/sign-api';
import { StartPage } from '../pages/start/start';
import { DocumentsPage } from '../pages/documents/documents';
declare var cordova: any;

@Component({
  templateUrl: 'app.html',
})
export class SmaVieMobilite {
  @ViewChild(Nav) nav: Nav;
  rootPage = TabsPage;
  pages: Array<{ title: string, component: any, icon: any, color: any }>;
  isAut: boolean = false;
  userData: any = {};
  constructor(public platform: Platform,
    public events: Events,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public couch: CouchDbServices) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
    this.events.subscribe('userChange', eventData => {
      this.userData = eventData[0];
      this.isAut = eventData[0]['ok'];
    });
    this.pages = [
      { title: 'Rendez-vous', component: StartPage, icon: "people", color: "primary" },
      { title: 'Synchronisation', component: SynchroPage, icon: "sync", color: "danger" },
      { title: 'Espace Documentaire', component: DocumentsPage, icon: "albums", color: "action" },
      { title: 'Outil de signature', component: SignApiPage, icon: "bug", color: "secondary" }
    ];
  }
  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        StatusBar.styleDefault();
        window.open = cordova.InAppBrowser.open;
      }
    });
  };
  ngOnInit() {
    this.couch.verifSession(true).then(response => {
      this.userData = response;
      this.isAut = true;
      this.nav.setRoot(HomePage, this.userData);
    }, error => {
      console.log("Verif return", error);
      this.isAut = false;
      this.userData = {};
      this.nav.setRoot(AuthPage);
    });
  };
  connect() {
    this.menu.close();
    this.callConnect()
  };
  callConnect() {
    console.log("Call AUTH page");
    let modal = this.modalCtrl.create(AuthPage);
    modal.onDidDismiss(response => {
      console.log("Return from AUTH page", response);
      this.userData = response;
      this.nav.setRoot(HomePage, this.userData);
    })
  }
  disConnect() {
    this.menu.close();
    this.couch.closeSession();
    this.userData = {};
    this.isAut = false;
    this.nav.setRoot(AuthPage);
  };
  goHome() {
    this.menu.close();
    this.nav.setRoot(HomePage, this.userData);
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
