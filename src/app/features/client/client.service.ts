// src/app/features/client/client.service.ts

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../core/constants/api.constants';
import { ClientDto } from './client-list/client-list';

export type ClientCreateDto = Omit<ClientDto, 'id'> & { password: string };
export type ClientUpdateDto = Omit<ClientDto, 'id'> & { password?: string };

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl: string;
  private readonly clientUrl = '/Client';

  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) baseUrl: string
  ) {
    this.apiUrl = baseUrl + this.clientUrl;
  }

  getAllClients(): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(this.apiUrl);
  }

  createClient(client: ClientCreateDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(this.apiUrl, client);
  }

  updateClient(id: number, client: ClientUpdateDto): Observable<ClientDto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<ClientDto>(url, client);
  }

  deleteClient(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}