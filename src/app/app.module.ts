import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SmaVieMobilite } from './app.component';
import { AboutPage } from '../pages/about/about';
import { AuthPage } from '../pages/auth/auth';
import { ContactPage } from '../pages/contact/contact';
import { DocumentsPage } from '../pages/documents/documents';
import { HomePage } from '../pages/home/home';
import { RdvPage } from '../pages/rdv/rdv';
import { ConcurrentsPage } from '../pages/rdv/concurrents/concurrents';
import { DecouvertePage } from '../pages/rdv/decouverte/decouverte';
import { DiagConseilPage } from '../pages/rdv/diag-conseil/diag-conseil';
import { OptionCopierPage } from '../pages/rdv/option-copier/option-copier';
import { OptionPiecesPage } from '../pages/rdv/option-pieces/option-pieces';
import { PatrimoinePage } from '../pages/rdv/patrimoine/patrimoine';
import { ProfilRisquePage } from '../pages/rdv/profil-risque/profil-risque';
import { SignaturePage } from '../pages/rdv/signature/signature';
import { SynthesePage } from '../pages/rdv/synthese/synthese';
import { StartPage } from '../pages/start/start';
import { SynchroPage } from '../pages/synchro/synchro';
import { TabsPage } from '../pages/tabs/tabs';
// components
import { FlexDisplay } from '../components/flex-display/flex-display';
import { FlexInput } from '../components/flex-input/flex-input';
import { FlexList } from '../components/flex-list/flex-list';
import { PdfViewer } from '../components/pdf-viewer/pdf-viewer';
import { Record } from '../components/record/record';
import { Stat } from '../components/stat/stat';
// providers
import { CalcTools } from '../providers/comon/calculate';
import { DisplayTools } from '../providers/comon/display';
import { CouchDbServices } from '../providers/couch/couch';
import { JsonDemo } from '../providers/json-demo/json-demo';
import { Paramsdata } from '../providers/params-data/params-data';
import { Pouch } from '../providers/pouch/pouch';
import { SignServices } from '../providers/sign/sign';
import { Simu } from '../providers/simu/simu';
// pipes
import { ValuesPipe, arrayByKeyPipe, binaryData, groupBy, KeysPipe, maxByKeyPipe, textToDate } from '../pipes/comon';


@NgModule({
  declarations: [
    SmaVieMobilite,
    AboutPage,
    AuthPage,
    ContactPage,
    DocumentsPage,
    HomePage,
    RdvPage,
    ConcurrentsPage,
    DecouvertePage,
    DiagConseilPage,
    OptionCopierPage,
    OptionPiecesPage,
    PatrimoinePage,
    ProfilRisquePage,
    SignaturePage,
    SynthesePage,
    StartPage,
    SynchroPage,
    TabsPage,
    ValuesPipe, arrayByKeyPipe, binaryData, groupBy, KeysPipe, maxByKeyPipe, textToDate,
    FlexDisplay, FlexInput, FlexList, PdfViewer, Record, Stat
  ],
  imports: [
    IonicModule.forRoot(SmaVieMobilite)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmaVieMobilite,
    AboutPage,
    AuthPage,
    ContactPage,
    DocumentsPage,
    HomePage,
    RdvPage,
    ConcurrentsPage,
    DecouvertePage,
    DiagConseilPage,
    OptionCopierPage,
    OptionPiecesPage,
    PatrimoinePage,
    ProfilRisquePage,
    SignaturePage,
    SynthesePage,
    StartPage,
    SynchroPage,
    TabsPage,
    FlexDisplay, FlexInput, FlexList, PdfViewer, Record, Stat
  ],
  providers: [Storage, CalcTools, DisplayTools, CouchDbServices, JsonDemo, Paramsdata, Pouch, SignServices, Simu]
})
export class AppModule { }
