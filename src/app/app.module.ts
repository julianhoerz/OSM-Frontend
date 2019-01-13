import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';

import { AppComponent } from './app.component';
import { Controller } from './controller.component';
import { CommonModule } from '@angular/common';
import { PlatformModule} from '@angular/cdk/platform';
import { PortalModule} from '@angular/cdk/portal';
import { SettingsComponent } from './settings/settings.component';
import { MaterialModule} from './material-module';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ApiService} from './_services/api.service';
import { HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    Controller,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OverlayModule,
    A11yModule,
    CommonModule,
    PlatformModule,
    PortalModule,
    MaterialModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
  entryComponents: [
    Controller,
    SettingsComponent
    ]
})
export class AppModule { }
