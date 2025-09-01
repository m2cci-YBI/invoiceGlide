import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'invoice-angular-ui';
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.events.subscribe(ev => {
      // if (ev instanceof NavigationStart) {
      //   console.log('[App] NavigationStart ->', ev.url);
      // } else if (ev instanceof NavigationEnd) {
      //   console.log('[App] NavigationEnd ->', ev.urlAfterRedirects);
      // }
    });
  }
}
