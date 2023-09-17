import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TrackComponent } from './track/track.component';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    TrackComponent,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage(getApp())),
    // provideAuth(() => getAuth()),
    // provideFunctions(() => getFunctions()),
    // providePerformance(() => getPerformance()),
    // rovideRemoteConfig(() => getRemoteConfig()),
    // provideAnalytics(() => getAnalytics()),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }