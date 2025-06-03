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
import { MockDataService } from '../../../core/services/mock-data.service';
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
    private mockDataService: MockDataService,
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
