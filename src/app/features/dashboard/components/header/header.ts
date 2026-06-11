import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() userName = '';
  @Output() logoutEvent = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigate(path: string): void { this.router.navigate([path]); }

  isActive(path: string): boolean { return this.router.url.startsWith(path); }
}
