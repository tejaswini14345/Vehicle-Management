// transaction.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'https://zgfiqz1qq9.execute-api.us-east-2.amazonaws.com/dev';

  constructor(private http: HttpClient) {}

  getUserTransactions(userId: string): Observable<Transaction[]> {
    const transactionsUrl = `${this.apiUrl}/user/transactions`;
    const body = { user_id: userId };
    return this.http.post<Transaction[]>(transactionsUrl, body);
  }
}
