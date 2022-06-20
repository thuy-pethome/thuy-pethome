import { Component } from '@angular/core';
const VERSION = 'VERSION';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    const day = String(new Date().getDate());
    const v = window.localStorage.getItem(VERSION);
    if (!(v && v === day)) {
      window.localStorage.setItem(VERSION, day);
      window.location.reload();
    } else {
      console.log('version 1.0');
    }
  }
  get isMobile() {
    return window.innerWidth < 768;
  }
}
