// user-transactions.component.ts

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrls: ['./user-transactions.component.scss'],
})
export class UserTransactionsComponent implements OnInit {
  userProfile: any;
  userTransactions: Transaction[] = [];
  displayedColumns: string[] = ['transaction_id', 'model', 'make', 'color', 'year', 'transaction_date', 'transaction_type', 'status'];
  isLoading: boolean = true; // Add loading state variable

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userProfile = JSON.parse(localStorage.getItem('user_data') || '{}');
    const userId = this.userProfile.user_id;
    this.getUserTransactions(userId);
  }

  getUserTransactions(userId: string): void {
    this.loadingService.show(); // Show the loading spinner
    this.transactionService.getUserTransactions(userId).subscribe(
      (transactions) => {
        this.userTransactions = transactions;

        // Manually trigger change detection
        this.changeDetectorRef.detectChanges();
        this.loadingService.hide(); // Hide the loading spinner after data is loaded
      },
      (error) => {
        console.error('Error fetching user transactions:', error);
      }
    );
  }
}
