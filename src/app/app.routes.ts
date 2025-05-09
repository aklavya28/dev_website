import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SchemesComponent } from './pages/schemes/schemes.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { FdCalculatorComponent } from './pages/fd-calculator/fd-calculator.component';
import { CalculatorComponent } from './pages/calculator/calculator.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "about", component: AboutComponent},
    {path: "plans", component: SchemesComponent},
    {path: "contact", component: ContactComponent},
    {path: "privacy", component: PrivacyComponent},
    {path: "fd-calculator", component: FdCalculatorComponent},
    {path: "calculator", component: CalculatorComponent},
    {
        path: '**',
        redirectTo: '',
      },
];
