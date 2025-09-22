import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SchemesComponent } from './pages/schemes/schemes.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { WebDashboardComponent } from './pages/web-dashboard/web-dashboard.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "about", component: AboutComponent},
    {path: "plans", component: SchemesComponent},
    {path: "contact", component: ContactComponent},
    {path: "privacy-policy", component: PrivacyComponent},
    {path: "web-dashboard", component: WebDashboardComponent},
    {
        path: '**',
        redirectTo: '',
      },
];
