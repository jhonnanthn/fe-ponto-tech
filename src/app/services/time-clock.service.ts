import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeClockRecords } from '../model/time-clock-records.model';

@Injectable({ providedIn: 'root' })
export class TimeClockService {
  private baseUrl = 'http://localhost:8080/v1/time-clock-records';

  constructor(private http: HttpClient) {}

  getRecordsByDate(date: string): Observable<TimeClockRecords[]> {
    console.log('Fetching records for date:', date);
    const params = new HttpParams().set('date', date);
    return this.http.get<TimeClockRecords[]>(`${this.baseUrl}/by-date`, { params });
  }

  registerClock(): Observable<TimeClockRecords> {
    return this.http.post<TimeClockRecords>(`${this.baseUrl}`, {});
  }
}
