import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CandidateService } from '../../../core/services/candidate.service';
import { Candidate } from '../../../models/candidate.model';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './candidate-list.component.html',
  styleUrl: './candidate-list.component.css'
})
export class CandidateListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'vacancy', 'score', 'applicationDate'];
  candidates: Candidate[] = [];
  isLoading = false;
  error: string | null = null;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private candidateService: CandidateService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    this.error = null;
    
    const params = {
      page: (this.pageIndex + 1).toString(),
      pageSize: this.pageSize.toString()
    };

    console.log('Fetching candidates with params:', params);
    console.log('API URL:', this.candidateService['apiUrl']);
    
    this.candidateService.getCandidates(params).subscribe({
      next: (response: any) => {
        console.log('Raw API response:', JSON.stringify(response, null, 2));
        
        if (!response) {
          console.error('Empty response received from API');
          this.error = 'Received empty response from server';
          this.isLoading = false;
          return;
        }
        
        // Check if response is an array directly or if it's nested under a data property
        if (Array.isArray(response)) {
          this.candidates = response;
          this.totalItems = response.length;
        } else if (response.data && Array.isArray(response.data)) {
          this.candidates = response.data;
          this.totalItems = response.total || response.data.length;
        } else {
          console.error('Unexpected response format:', response);
          this.error = 'Unexpected response format from server';
          this.candidates = [];
          this.totalItems = 0;
        }
        
        this.isLoading = false;
        console.log(`Processed ${this.candidates.length} candidates`);
        console.log('First candidate:', this.candidates[0]);
      },
      error: (error: any) => {
        console.error('Error loading candidates:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Failed to load candidates';
        if (error.status === 0) {
          errorMessage = 'Cannot connect to the server. Please check your connection and try again.';
        } else if (error.error) {
          errorMessage = error.error.message || error.statusText || errorMessage;
        }
        
        this.error = errorMessage;
        this.isLoading = false;
        this.showError(errorMessage);
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
    this.router.navigate(['/candidates', id]);
  }

  getFirstApplication(candidate: Candidate): any {
    return candidate.applications && candidate.applications.length > 0 
      ? candidate.applications[0] 
      : null;
  }

  addCandidate(): void {
    const dialogRef = this.dialog.open(CandidateFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'candidate-form-dialog',
      position: {
        top: '50px'
      },
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: Candidate | undefined) => {
      if (result) {
        // Add the new candidate to the beginning of the list
        this.candidates = [result, ...this.candidates];
        this.totalItems += 1;
        this.showSuccess('Candidate added successfully!');
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  }
}
