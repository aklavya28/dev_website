import { Router, Scroll, Event, ActivatedRoute } from '@angular/router';
import { Component, NgZone, OnInit, output } from '@angular/core';
import { HeaderTitleComponent } from '../../layout/header/header-title/header-title.component';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-schemes',
  imports: [HeaderTitleComponent],
  templateUrl: './schemes.component.html',
  styleUrl: './schemes.component.scss'
})
export class SchemesComponent implements OnInit {
  constructor(private route: ActivatedRoute, private viewportScroller: ViewportScroller, private ngZone: NgZone){

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
  // ngOnInit(): void {
  //   // let d = HeaderTitleComponent
  //   this.route.fragment.subscribe((fragment) => {
  //     if (fragment) {
  //       console.log("sdfsfsdffd", fragment)

  //       this.viewportScroller.scrollToAnchor(fragment);
  //       console.log("fffffffd", this.viewportScroller.scrollToAnchor(fragment))
  //     }
  //   });


  //   // this.route.fragment.subscribe(fregment =>{
  //   //   if(fregment){
  //   //     console.log(fregment, "inner")
  //   //     let f =  document.getElementById(fregment)


  //   //     const yOffset = -100; // Adjust for any fixed headers
  //   //     if(f){
  //   //       console.log("id", f)
  //   //       const y = f.getBoundingClientRect().top + window.scrollY + yOffset;
  //   //       window.scrollTo({ top: y, behavior: 'smooth' });
  //   //     }

  //   //     // this.viewportScroller.scrollToAnchor(fregment)
  //   //     // console.log(this.viewportScroller)
  //   //   }
  //   // })
  // }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        console.log('Scrolling to fragment:', fragment);
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.viewportScroller.scrollToAnchor(fragment);
          }, 0); // Delay to ensure DOM is ready
        });
      }
    });  
  }
}
