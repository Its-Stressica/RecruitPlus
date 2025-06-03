import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { VacancyService, VacancyGetDto } from '../../../core/services/vacancy.service';
import { ApplicationService } from '../../../core/services/application.service';

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
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.css']
})
export class VacancyListComponent implements OnInit {
  isLoading = true;
  vacancies: VacancyGetDto[] = [];
  displayedColumns: string[] = ['title', 'quota', 'createdAt', 'actions'];
  
  constructor(
    private vacancyService: VacancyService,
    private applicationService: ApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.loadVacancies();
  }

  loadVacancies(): void {
    console.log('Loading vacancies...');
    this.isLoading = true;
    
    this.vacancyService.getVacancies()
      .pipe(
        finalize(() => {
          console.log('Loading completed');
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (vacancies) => {
          console.log('Received vacancies:', vacancies);
          this.vacancies = vacancies;
          console.log('Vacancies assigned:', this.vacancies);
        },
        error: (error) => {
          console.error('Error loading vacancies:', error);
          this.snackBar.open('Failed to load vacancies. Check console for details.', 'Dismiss', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  loadActiveVacancies(): void {
    this.isLoading = true;
    this.vacancyService.getActiveVacancies()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (vacancies) => {
          this.vacancies = vacancies;
        },
        error: (error) => {
          console.error('Error loading active vacancies:', error);
          this.snackBar.open('Failed to load active vacancies', 'Dismiss', { duration: 3000 });
        }
      });
  }

  viewVacancy(id: string): void {
    this.router.navigate(['/vacancies', id]);
  }

  editVacancy(id: string): void {
    this.router.navigate(['/vacancies', id, 'edit']);
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
  }

  confirmDeleteVacancy(vacancy: VacancyGetDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Vacancy',
        message: `Are you sure you want to delete the vacancy "${vacancy.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteVacancy(vacancy.id);
      }
    });
  }

  private deleteVacancy(id: string): void {
    this.vacancyService.deleteVacancy(id).subscribe({
      next: () => {
        this.snackBar.open('Vacancy deleted successfully', 'Dismiss', { duration: 3000 });
        this.loadVacancies();
      },
      error: (error) => {
        console.error('Error deleting vacancy:', error);
        this.snackBar.open('Failed to delete vacancy', 'Dismiss', { duration: 3000 });
      }
    });
  }

  /**
   * Runs the assignment Algorithm to assign candidates to vacancies
   */
  runAssignmentAlgorithm(): void {
    if (confirm('Run the assignment Algorithm? This will assign candidates to vacancies based on their scores and preferences.')) {
      this.isLoading = true;
      this.applicationService.runAssignmentAlgorithm().subscribe({
        next: (response: { message?: string }) => {
          this.snackBar.open(response.message || 'Assignment Algorithm completed successfully', 'Close', { duration: 5000 });
          this.loadVacancies();
        },
        error: (error: any) => {
          console.error('Error running assignment Algorithm:', error);
          const errorMessage = error.error?.message || 'Failed to run assignment Algorithm';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Resets all application assignments after confirmation
   */
  resetAllAssignments(): void {
    if (confirm('Are you sure you want to reset all assignments? This will unassign all candidates from all vacancies.')) {
      this.isLoading = true;
      this.applicationService.resetAssignments().subscribe({
        next: () => {
          this.snackBar.open('All assignments have been reset', 'Close', { duration: 3000 });
          this.loadVacancies();
        },
        error: (error: any) => {
          console.error('Error resetting assignments:', error);
          this.snackBar.open('Failed to reset assignments', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }
}
