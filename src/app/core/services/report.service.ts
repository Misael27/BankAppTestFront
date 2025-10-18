import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/api.constants';
import { MovementReportDto, MovementReportQuery } from '../dtos/report.dto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string
  ) {
    this.apiUrl = `${this.baseUrl}/Report/movement-report`;
  }

  getMovementReport(query: MovementReportQuery): Observable<MovementReportDto[]> {
    let params = new HttpParams()
      .set('startDate', query.startDate)
      .set('endDate', query.endDate);

    if (query.clientId) {
      params = params.set('clientId', query.clientId.toString());
    }

    return this.http.get<MovementReportDto[]>(this.apiUrl, { params });
  }
}