import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';

import { AppComponent,SpagettiPanel } from './app.component';
import { CommonModule } from '@angular/common';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    SpagettiPanel,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    OverlayModule,
    A11yModule,
    CommonModule,
    PlatformModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    SpagettiPanel,
    SettingsComponent
    ]
})
export class AppModule { }
