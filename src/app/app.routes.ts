import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SchemesComponent } from './pages/schemes/schemes.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "about", component: AboutComponent},
    {path: "plans", component: SchemesComponent},
    {path: "contact", component: ContactComponent},
    {
        path: '**',
        redirectTo: '',
      },
];
