// loading-spinner.component.ts

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private loadingService: LoadingService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Spinner hit');
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
      console.log('Loading state:', loading);
      this.cdr.detectChanges();
    });
  }
}
