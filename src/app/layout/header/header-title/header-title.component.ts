import { Component, Input, Output} from '@angular/core';

@Component({
  selector: 'app-header-title',
  imports: [],
  templateUrl: './header-title.component.html',
  styleUrl: './header-title.component.scss'
})
export class HeaderTitleComponent {
  @Input() title: string = 'Default Title';
}
