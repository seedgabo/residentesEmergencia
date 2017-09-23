import { AddChatPage } from './../pages/add-chat/add-chat';
import { ChatsPage } from './../pages/chats/chats';
import { PetsPage } from './../pages/pets/pets';
import { ZoneReservationPage } from './../pages/zone-reservation/zone-reservation';
import { WorkersPage } from './../pages/workers/workers';
import { VehiclesPage, } from './../pages/vehicles/vehicles';
import { VehiclesEditorPage } from './../pages/vehicle-editor/vehicle-editor';
import { TablesPage } from './../pages/tables/tables';
import { PaymentReportPage } from './../pages/payment-report/payment-report';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MomentModule } from 'angular2-moment';

import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ParkingsPage } from '../pages/parkings/parkings';
import { VisitorsPage } from '../pages/visitors/visitors';
import { Login } from "../pages/login/login";
import { Residences } from "../pages/residences/residences";
import { NewVisitPage } from "../pages/new-visit/new-visit";
import { NewVisitorPage } from "../pages/new-visitor/new-visitor";
import { CreateVisitPage } from "../pages/create-visit/create-visit";
import { VisitTabsPage } from "../pages/visit-tabs/visit-tabs";
import { VisitsPage } from "../pages/visits/visits";
import { VisitPage } from "../pages/visit/visit";


import { Api } from "../providers/api";
import { TransPipe } from '../pipes/trans/trans';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { Vibration } from '@ionic-native/vibration';
import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from '@ionic-native/google-plus';
import { BackgroundMode } from "@ionic-native/background-mode";
import { AppMinimize } from "@ionic-native/app-minimize";
import { CodePush } from '@ionic-native/code-push';
import { OneSignal } from "@ionic-native/onesignal";
import { Device } from "@ionic-native/device";
import { File } from '@ionic-native/file';
import { FileOpener } from "@ionic-native/file-opener";
import { Transfer } from "@ionic-native/transfer";
import { Deeplinks } from "@ionic-native/deeplinks";
import { EventsPage } from "../pages/events/events";
import { AddEventPage } from "../pages/add-event/add-event";
import { EventPage } from "../pages/event/event";
import { InvoicesPage } from "../pages/invoices/invoices";
import { InvoicePage } from "../pages/invoice/invoice";
import { DocumentsPage } from "../pages/documents/documents";
import { NewsComponent } from '../components/news/news';
import { PostsPage } from "../pages/posts/posts";
import { AddPostPage } from "../pages/add-post/add-post";

import { AutoCompleteModule } from 'ionic2-auto-complete';
import { SurveysPage } from "../pages/surveys/surveys";
import { SurveyPage } from "../pages/survey/survey";
import { ProfilePage } from "../pages/profile/profile";

import { DatePickerModule } from 'datepicker-ionic2';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { WorkersEditorPage } from "../pages/worker-editor/worker-editor";
import { PetsEditorPage } from "../pages/pet-editor/pet-editor";
import { ReservationsPage } from "../pages/reservations/reservations";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ParkingsPage,
    VisitorsPage,
    VisitsPage,
    VisitPage,
    ReservationsPage,
    NewVisitorPage,
    Login,
    Residences,
    EventsPage,
    EventPage,
    InvoicesPage,
    InvoicePage,
    DocumentsPage,
    NewVisitPage,
    PostsPage,
    ProfilePage,
    CreateVisitPage,
    TransPipe,
    VisitTabsPage,
    TablesPage,
    VehiclesPage,
    VehiclesEditorPage,
    WorkersPage,
    WorkersEditorPage,
    PetsPage,
    PetsEditorPage,
    AddEventPage,
    AddPostPage,
    SurveysPage,
    SurveyPage,
    PaymentReportPage,
    NewsComponent,
    ZoneReservationPage,
    ChatsPage,
    AddChatPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AutoCompleteModule,
    MomentModule,
    DatePickerModule,
    RoundProgressModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ParkingsPage,
    VisitorsPage,
    VisitsPage,
    VisitPage,
    ReservationsPage,
    NewVisitPage,
    NewVisitorPage,
    Login,
    Residences,
    EventsPage,
    EventPage,
    InvoicesPage,
    InvoicePage,
    DocumentsPage,
    PostsPage,
    ProfilePage,
    TablesPage,
    VehiclesPage,
    VehiclesEditorPage,
    WorkersPage,
    WorkersEditorPage,
    PetsPage,
    PetsEditorPage,
    NewVisitPage,
    CreateVisitPage,
    VisitTabsPage,
    AddEventPage,
    AddPostPage,
    SurveysPage,
    SurveyPage,
    PaymentReportPage,
    ZoneReservationPage,
    ChatsPage,
    AddChatPage,
  ],
  providers: [
    StatusBar, SplashScreen, Camera, Facebook, GooglePlus, AppMinimize, BackgroundMode, CodePush, OneSignal, Device,
    Deeplinks, Transfer, File, FileOpener, Vibration,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Api,
  ]
})
export class AppModule { }
