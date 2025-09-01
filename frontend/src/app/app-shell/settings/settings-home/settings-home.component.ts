import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.css']
})
export class SettingsHomeComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
    console.log('[SettingsHomeComponent] ctor');
  }
  ngOnInit(): void {
    console.log('[SettingsHomeComponent] ngOnInit path=', this.route.snapshot.routeConfig?.path);
  }
}
