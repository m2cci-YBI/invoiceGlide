import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../settings.service';
import { SettingsBaseComponent } from './settings-base.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends SettingsBaseComponent implements OnInit {
  constructor(
    public override settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(settingsService);
    console.log('[SettingsComponent] ctor route=', this.route.snapshot.url.map(s=>s.path).join('/'));
  }

  ngOnInit(): void {
    console.log('[SettingsComponent] ngOnInit url=', this.router.url);
    this.route.url.subscribe(u => console.log('[SettingsComponent] route.url=', u.map(s=>s.path).join('/')));
    this.route.firstChild?.url.subscribe(u => console.log('[SettingsComponent] firstChild.url=', u.map(s=>s.path).join('/')));
    this.router.events.subscribe(e => {
      // Keep logs concise
      const t = (e as any).constructor?.name;
      if (t === 'NavigationStart' || t === 'NavigationEnd') {
        console.log('[Router]', t, (e as any).url);
      }
    });
  }
}
