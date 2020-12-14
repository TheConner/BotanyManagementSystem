import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Toast, ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';
import { HotTableModule } from '@handsontable/angular';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { IndexComponent } from './views/index/index.component';
import { EnvironmentComponent } from './views/environment/environment.component';
import { SensorComponent } from './views/sensor/sensor.component';
import { ConfigurationComponent } from './views/configuration/configuration.component';
import { LoadingSpinnerComponent } from './views/loading-spinner/loading-spinner.component';
import { MediaComponent } from './views/media/media.component';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    EnvironmentComponent,
    SensorComponent,
    ConfigurationComponent,
    LoadingSpinnerComponent,
    MediaComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    ToastrModule.forRoot(),
    HttpClientModule,
    ChartsModule,
    HotTableModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function() {
        return new AuthService();
      },
      multi: true,
      deps: [Router]
    }
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
