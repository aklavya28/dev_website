import { Router, Scroll, Event, ActivatedRoute } from '@angular/router';
import { Component, OnInit, output } from '@angular/core';
import { HeaderTitleComponent } from '../../layout/header/header-title/header-title.component';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-schemes',
  imports: [HeaderTitleComponent],
  templateUrl: './schemes.component.html',
  styleUrl: './schemes.component.scss'
})
export class SchemesComponent implements OnInit {
  constructor(private aRoute: ActivatedRoute, private viewportScroller: ViewportScroller){

    // viewportScroller.setOffset([0, 50]);
    // this.router.events.subscribe((event: Event) => {
    //   console.log('Event:', event.urlAfterRedirects);
    // });
    // router.events.pipe(filter(e => e instanceof Scroll)).subscribe((e: Scroll) => {

    //   if (e.anchor) {
    //     // anchor navigation
    //     /* setTimeout is the core line to solve the solution */
    //     setTimeout(() => {
    //       viewportScroller.scrollToAnchor("rd");
    //     })
    //   } else if (e.position) {
    //     // backward navigation
    //     viewportScroller.scrollToPosition(e.position);
    //   } else {
    //     // forward navigation
    //     viewportScroller.scrollToPosition([0, 0]);
    //   }
    // });
  }
  ngOnInit(): void {
    this.aRoute.fragment.subscribe(fregment =>{
      if(fregment){
        this.viewportScroller.scrollToAnchor(fregment)
        }


    })
  }
}
