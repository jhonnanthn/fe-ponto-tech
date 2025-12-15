import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  isCollapsed = true;

  private _shownHandler?: () => void;
  private _hiddenHandler?: () => void;

  constructor(private auth: AuthService, private router: Router, private ngZone: NgZone) {}

  toggle = () => {
    this.isCollapsed = !this.isCollapsed;
  };

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get user(): User | null {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('auth.user') : null;
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
