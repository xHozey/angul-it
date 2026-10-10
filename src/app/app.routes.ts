import { Routes } from '@angular/router';
import { CaptchaComponent } from './captcha-component/captcha-component';
import { HomeComponent } from './home-component/home-component';
import { ResultComponent } from './result-component/result-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'captcha', component: CaptchaComponent },
  { path: 'result', component: ResultComponent },
  { path: '**', redirectTo: '' },
];
