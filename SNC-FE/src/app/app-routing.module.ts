import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { Home } from '@components/home/home.component';
import { Account } from '@components/account/account.component';
import { Login } from '@components/login/login.component';
import { Register } from '@components/register/register.component';
import { Pci } from '@components/pci/pci.component';
import { AuthGuardService } from '@services/authguard.service';
import { Saq } from '@components/saq/saq.component';
import { Form } from '@components/form/form.component';
import { Details } from '@components/details/details.component';
import { Password } from '@components/password/password.component';









const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'account', component: Account, canActivate: [AuthGuardService] },
  { path: 'account/details', component: Details, canActivate: [AuthGuardService] },
  { path: 'account/details/password', component: Password, canActivate: [AuthGuardService] },
   { path: 'account/pci', component: Pci, canActivate: [AuthGuardService] },
   {path: 'account/pci/saq/:type', component: Saq, canActivate: [AuthGuardService]},
   {path: 'account/pci/saq/:type/form', component: Form, canActivate: [AuthGuardService]}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
