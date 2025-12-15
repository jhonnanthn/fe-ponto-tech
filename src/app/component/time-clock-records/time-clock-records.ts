import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TimeClockService } from '../../services/time-clock.service';
import { TimeClockRecords } from '../../model/time-clock-records.model';

interface ClockRecord {
  type: string;
  time: string;
  heia: string;
  status: string;
}

@Component({
  selector: 'app-time-clock-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-clock-records.html',
  styleUrls: ['./time-clock-records.scss']
})
export class TimeClockRecordsComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  currentDate: string = '';
  dailyRecords: ClockRecord[] = [];
  private intervalId?: number;

  private router = inject(Router);
  private timeClockService = inject(TimeClockService);

  ngOnInit() {
    this.updateClock();
    this.intervalId = window.setInterval(() => this.updateClock(), 1000);
    this.loadDailyRecords();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateClock() {
    const now = new Date();
    
    // Formatar hora
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    this.currentTime = `${displayHours}:${minutes}:${seconds} ${period}`;
    
    // Formatar data
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    this.currentDate = `${dayName}, ${day} de ${month} ${year}`;
  }

  private loadDailyRecords() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    this.timeClockService.getRecordsByDate(dateStr).subscribe({
      next: (records: TimeClockRecords[]) => {
        console.log('records', records);
        this.dailyRecords = records.map((record, index) => {
          const timestamp = new Date(record.timestamp);
          const time = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
          
          return {
            type: index === 0 ? 'Entrada' : index === records.length - 1 ? 'Último Registro' : 'Registro',
            time: time,
            heia: '12:00',
            status: record.location || 'Presencial'
          };
        });
      },
      error: (error) => {
        console.error('Erro ao carregar registros:', error);
        this.dailyRecords = [];
      }
    });
  }

  registerClock() {
    this.timeClockService.registerClock().subscribe({
      next: () => {
        console.log('Ponto registrado com sucesso');
        this.loadDailyRecords();
      },
      error: (error) => {
        console.error('Erro ao registrar ponto:', error);
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const newRecord: ClockRecord = {
          type: this.dailyRecords.length % 2 === 0 ? 'Entrada' : 'Saída',
          time: time,
          heia: '12:00',
          status: 'Presencial'
        };
        
        this.dailyRecords.push(newRecord);
      }
    });
  }

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
