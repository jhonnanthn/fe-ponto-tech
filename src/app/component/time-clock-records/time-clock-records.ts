import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-time-clock-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-clock-records.html',
  styleUrls: ['./time-clock-records.scss']
})
export class TimeClockRecordsComponent {
  constructor(private router: Router) {}

  logout() {
    try {
      localStorage.removeItem('auth.token');
      localStorage.removeItem('auth.user');
    } catch (e) {
      console.error('Erro ao limpar storage', e);
    }
    this.router.navigate(['/login']);
  }
}
