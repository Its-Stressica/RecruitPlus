import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Candidate } from '../../../models/candidate.model';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './candidate-list.component.html',
  styleUrl: './candidate-list.component.css'
})
export class CandidateListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'status', 'applicationDate', 'actions'];
  candidates: Candidate[] = [];
  isLoading = false;
  error: string | null = null;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private mockDataService: MockDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    this.error = null;
    
    this.mockDataService.getCandidates(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response) => {
        this.candidates = response.data || [];
        this.totalItems = response.total || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.error = 'Failed to load candidates';
        this.isLoading = false;
        this.showError('Failed to load candidates');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCandidates();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  viewCandidate(id: string): void {
    // Implement view functionality
    console.log('View candidate:', id);
  }

  editCandidate(id: string): void {
    // Implement edit functionality
    console.log('Edit candidate:', id);
  }

  addCandidate(): void {
    // Implement add functionality
    console.log('Add new candidate');
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'status-new';
      case 'in review':
        return 'status-in-review';
      case 'interview':
        return 'status-interview';
      case 'hired':
        return 'status-hired';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }
}
