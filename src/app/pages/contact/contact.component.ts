import { Component } from '@angular/core';
import { HeaderTitleComponent } from '../../layout/header/header-title/header-title.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee,faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-contact',
  imports: [HeaderTitleComponent, FontAwesomeModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  faCoffee = faCoffee;
  faUser = faUser;
}
