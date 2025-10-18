import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/api.constants';
import { MovementDto, MovementRequest } from '../dtos/movement.dto';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string
  ) {
    this.apiUrl = `${this.baseUrl}/Movement`;
  }

  getMovements(): Observable<MovementDto[]> {
    return this.http.get<MovementDto[]>(this.apiUrl);
  }

  getMovementById(id: number): Observable<MovementDto> {
    return this.http.get<MovementDto>(`${this.apiUrl}/${id}`);
  }

  createMovement(movement: MovementRequest): Observable<MovementDto> {
    return this.http.post<MovementDto>(this.apiUrl, movement);
  }

  deleteMovement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}