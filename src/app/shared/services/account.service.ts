import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/api.constants';
import { AccountDto, AccountRequest } from '../dtos/account.dto';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string
  ) {
    this.apiUrl = `${this.baseUrl}/Account`;
  }

  getAccounts(): Observable<AccountDto[]> {
    return this.http.get<AccountDto[]>(this.apiUrl);
  }

  getAccountById(id: number): Observable<AccountDto> {
    return this.http.get<AccountDto>(`${this.apiUrl}/${id}`);
  }

  createAccount(account: AccountRequest): Observable<AccountDto> {
    return this.http.post<AccountDto>(this.apiUrl, account);
  }

  updateAccount(id: number, account: AccountRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}