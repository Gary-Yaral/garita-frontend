import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CameraComponent } from './components/camera/camera.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { DriversComponent } from './components/drivers/drivers.component';
import { RolesComponent } from './components/roles/roles.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FloatNavbarComponent } from './components/float-navbar/float-navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistersComponent } from './components/registers/registers.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CameraComponent,
    VehiclesComponent,
    DriversComponent,
    RolesComponent,
    NavbarComponent,
    FloatNavbarComponent,
    LoginComponent,
    DashboardComponent,
    RegistersComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
