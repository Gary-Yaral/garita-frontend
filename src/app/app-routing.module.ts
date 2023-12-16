import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CameraComponent } from './components/camera/camera.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { DriversComponent } from './components/drivers/drivers.component';
import { RegistersComponent } from './components/registers/registers.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { AuthGuard } from './guards/auth.guard';
import { LoggedGuard } from './guards/logged.guard';
import { UsersComponent } from './components/users/users.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      {
        path:"home",
        component: HomeComponent
      },
      {
        path:"camera",
        component: CameraComponent
      },
      {
        path:"vehicles",
        component: VehiclesComponent
      },
      {
        path:"drivers",
        component: DriversComponent
      },
      {
        path:"registers",
        component: RegistersComponent
      },
      {
        path:"users",
        component: UsersComponent,
        canActivate: [AdminGuard]
      }
    ]
  },
  {
    path: "not-found-404",
    component: ErrorPageComponent
  },
  {
    path:"**",
    redirectTo: 'not-found-404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
