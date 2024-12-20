import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CollapseModule, GridModule,  NavbarModule, NavItemComponent } from '@coreui/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  imports: [RouterLink, NgClass, NavbarModule, GridModule, NavbarModule, NavItemComponent, CollapseModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',

})

export class HeaderComponent implements OnInit {
  currentRoute: string = '/';
  togglemenu:boolean= true

  private routerSubscription: Subscription | undefined
  constructor(private router: Router, private activatedRoute: ActivatedRoute,

  ) {}

  ngOnInit(): void {

    // Subscribe to router events to listen for route changes
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Update the currentRoute on navigation end
        this.currentRoute = event.urlAfterRedirects; // or event.url for raw URL
      }
    });
  }

}
