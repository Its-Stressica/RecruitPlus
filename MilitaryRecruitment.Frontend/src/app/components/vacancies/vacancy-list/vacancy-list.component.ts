import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ApiService, PaginationParams } from '../../../core/services/api.service';
import { Vacancy, VacancyListResponse } from '../../../models/vacancy.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './vacancy-list.component.html',
  styleUrl: './vacancy-list.component.css'
})
export class VacancyListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  isLoading = true;
  vacancies: Vacancy[] = [];
  displayedColumns: string[] = ['title', 'department', 'availablePositions', 'deadline', 'actions'];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  
  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.loadVacancies();
  }
  
  loadVacancies(): void {
    this.isLoading = true;
    const params: PaginationParams = {
      page: this.pageIndex + 1,
      pageSize: this.pageSize,
      isActive: true,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const
    };
    
    this.apiService.getActiveVacancies(params)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: VacancyListResponse) => {
          this.vacancies = response.data;
          this.totalItems = response.total;
        },
        error: (error: unknown) => {
          console.error('Error loading vacancies:', error);
          this.snackBar.open('Failed to load vacancies. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVacancies();
  }
  
  viewVacancyDetails(id: string): void {
    this.router.navigate(['/vacancies', id]);
  }
  
  applyForVacancy(vacancy: Vacancy): void {
    this.router.navigate(['/vacancies', vacancy.id, 'apply']);
  }
  
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  isDeadlinePassed(deadline: Date | string | null | undefined): boolean {
    if (!deadline) return false;
    const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline);
    return deadlineDate < new Date();
  }

  // Calculate the percentage of filled positions
  getQuotaFilledPercentage(vacancy: Vacancy): number {
    if (!vacancy.quota || vacancy.quota === 0) return 0;
    const filled = (vacancy.quota - (vacancy.availablePositions || 0)) / vacancy.quota * 100;
    return Math.min(100, Math.round(filled * 100) / 100); // Cap at 100% and round to 2 decimal places
  }

  // Get the number of filled positions
  getFilledPositions(vacancy: Vacancy): number {
    return Math.max(0, (vacancy.quota || 0) - (vacancy.availablePositions || 0));
  }

  // Create a new vacancy
  createNewVacancy(): void {
    this.router.navigate(['/recruiter/vacancies/new']);
  }

  // Confirm before deleting a vacancy
  confirmDeleteVacancy(vacancy: Vacancy): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the vacancy "${vacancy.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteVacancy(vacancy.id);
      }
    });
  }

  // Delete a vacancy
  private deleteVacancy(vacancyId: string): void {
    this.apiService.deleteVacancy(vacancyId).subscribe({
      next: () => {
        this.snackBar.open('Vacancy deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadVacancies(); // Refresh the list
      },
      error: (error) => {
        console.error('Error deleting vacancy:', error);
        this.snackBar.open('Failed to delete vacancy. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
