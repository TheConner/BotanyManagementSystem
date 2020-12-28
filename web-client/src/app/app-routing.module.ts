import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './views/configuration/configuration.component';
import { EnvironmentComponent } from './views/environment/environment.component';

import { IndexComponent } from './views/index/index.component';
import { MediaComponent } from './views/media/media.component';
import { ProfileComponent } from './views/profile/profile.component';
import { SensorComponent } from './views/sensor/sensor.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent, },
  { path: 'media', component: MediaComponent, },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'sensor/:sens', component: SensorComponent },
  { path: 'environments/:env', component: EnvironmentComponent },
  { path: '', component: IndexComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
