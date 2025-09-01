import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent implements OnInit {
  constructor(public settingsService: SettingsService, public auth: AuthService) { }

  ngOnInit(): void {
  }

}
