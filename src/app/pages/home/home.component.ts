import { routes } from './../../app.routes';


import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  CarouselCaptionComponent,
  CarouselComponent,
  CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  ThemeDirective
} from '@coreui/angular';

@Component({
  selector: 'app-home',
  imports: [ThemeDirective,CarouselCaptionComponent, CarouselComponent, CarouselIndicatorsComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselControlComponent, RouterModule],
  // standalone:false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',

})
export class HomeComponent implements OnInit {
  constructor(private router:Router){

  }
  // /assets/images/banner2.jpg
  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });
  ngOnInit(): void {
    this.slides = [{
      id: 1,
      src: 'assets/images/banner2.jpg',
      title: 'Second slide',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      id: 2,
      src: 'assets/images/banner_1.jpg',
      title: 'Third slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    },
    {
      id: 3,
      src: 'assets/images/banner_3.jpg',
      title: 'Third slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    },
    {
      id: 4,
      src: 'assets/images/banner_4.jpg',
      title: 'fourth slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    }
  ]

  }

}
