import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CameraComponent } from './components/camera/camera.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { DriversComponent } from './components/drivers/drivers.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FloatNavbarComponent } from './components/float-navbar/float-navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistersComponent } from './components/registers/registers.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './components/users/users.component';
import { NewRegisterComponent } from './components/new-register/new-register.component';
import { TableCommonComponent } from './components/table-common/table-common.component';
import { AlertComponent } from './components/alert/alert.component';
import { SERVER_CAMERA_PATH } from './config/constants';
import { FooterComponent } from './components/footer/footer.component';

const config: SocketIoConfig = { url: SERVER_CAMERA_PATH, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CameraComponent,
    VehiclesComponent,
    DriversComponent,
    NavbarComponent,
    FloatNavbarComponent,
    LoginComponent,
    DashboardComponent,
    RegistersComponent,
    ErrorPageComponent,
    UsersComponent,
    NewRegisterComponent,
    TableCommonComponent,
    AlertComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
