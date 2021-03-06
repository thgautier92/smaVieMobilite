import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, Events, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { CouchDbServices } from '../../providers/couch/couch';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'auth.html'
})
export class AuthPage {
  authType: string = "login";
  user: string;
  isAut: boolean = false;
  loginCreds: any;
  signupCreds: any;
  constructor(public nav: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public fb: FormBuilder, public couch: CouchDbServices, public events: Events) {
    //this.couch.closeSession();
  }
  ionViewLoaded() {
    this.loginCreds = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)
      ])]
    });
  }
  ngOnInit() { }
  login(credentials) {
    //console.log(credentials);
    this.couch.openSession(credentials, null).then(response => {
      //console.log(response);
      if (response['ok']) {
        console.log("User Auth validated");
        this.couch.verifSession(true).then(response => {
          this.isAut = true;
          this.events.publish('userChange', response);
          this.nav.setRoot(HomePage, response);
        }, error => {
          console.log(error);
          this.isAut = false;
          let toast = this.toastCtrl.create({
            message: 'Connexion impossible. Erreur technique.',
            duration: 3000
          });
          toast.present();
        });
      } else {
        console.log("Password not valid");
        let toast = this.toastCtrl.create({
          message: 'Utilisateur / mot de passe invalide !',
          duration: 3000
        });
        toast.present();
      }
    }, error => {
      console.log(error);
      let toast = this.toastCtrl.create({
        message: 'Utilisateur / mot de passe invalide !',
        duration: 3000
      });
      toast.present();
    })
  }
  createAccount() {
    this.nav.push(SignUpPage);
  }
  restart() {
    this.couch.closeSession();
    this.isAut = false;
    this.authType = "login";
  }
}

// SIGNUP component
@Component({
  templateUrl: 'signup.html',
})
export class SignUpPage {
  signupCreds: any;
  constructor(public nav: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public fb: FormBuilder, public couch: CouchDbServices, public events: Events) {
  }
  ionViewLoaded() {
    this.signupCreds = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)
      ])]
    });
  }
  signup(credentials) {
    console.log(credentials);
    this.couch.putUser(credentials, null).then(response => {
      console.log("CouchDB response", response);
      if (response['ok'] === true) {
        console.log("User Auth creation validated");
        let toast = this.toastCtrl.create({
          message: 'Compte crée. Vous pouvez vous connecter.',
          duration: 3000
        });
        toast.present();
        this.nav.pop();
      } else {
        console.log("Error during creating account");
        let toast = this.toastCtrl.create({
          message: 'Création du compte impossible. Erreur technique.',
          duration: 3000
        });
        toast.present();
      }
    }, error => {
      console.log(error);
      let toast = this.toastCtrl.create({
        message: 'Connexion impossible. Erreur technique.',
        duration: 3000
      });
      toast.present();
    })
  }
  cancel() {
    this.nav.pop();
  }
}
