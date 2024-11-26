import { Component, OnInit, output } from '@angular/core';
import { HeaderTitleComponent } from '../../layout/header/header-title/header-title.component';

@Component({
  selector: 'app-schemes',
  imports: [HeaderTitleComponent],
  templateUrl: './schemes.component.html',
  styleUrl: './schemes.component.scss'
})
export class SchemesComponent implements OnInit {
  ngOnInit(): void {
    let d = HeaderTitleComponent
    console.log("sdfsfsdffd", )
  }
}
