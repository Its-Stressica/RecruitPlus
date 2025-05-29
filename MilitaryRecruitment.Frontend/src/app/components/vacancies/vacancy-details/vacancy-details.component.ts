import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';

import { Application } from '../../../models/vacancy.model';
import { VacancyService, VacancyGetDto } from '../../../core/services/vacancy.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-vacancy-details',
  templateUrl: './vacancy-details.component.html',
  styleUrls: ['./vacancy-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
    MatTableModule
  ]
})
export class VacancyDetailsComponent implements OnInit {
  vacancy: VacancyGetDto | null = null;
  selectedTab = 0;
  applications: Application[] = [];
  isLoading = true;
  error: string | null = null;
  acceptedApplicationsCount = 0;
  
  // Computed properties to handle missing fields in DTO
  get availablePositions(): number {
    return this.vacancy?.quota || 0;
  }
  
  get applicationCount(): number {
    return this.applications?.length || 0;
  }
  
  get isActive(): boolean {
    // Assuming all vacancies from the API are active for now
    return true;
  }
  
  displayedColumns: string[] = ['candidate', 'score', 'status', 'appliedAt', 'actions'];
  
  // Track accepted applications count is now declared in the class properties

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private vacancyService: VacancyService,
    private dialog: MatDialog
  ) {}

  getApplicationProgress(application: Application): number {
    if (!this.vacancy || !application) return 0;
    
    const totalPositions = this.vacancy.quota || 1;
    const filledPositions = this.acceptedApplicationsCount;
    
    if (application.status === 'accepted') return 100;
    if (totalPositions - filledPositions <= 0) return 0;
    
    const progress = (filledPositions / totalPositions) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
  }

  getVacancyProgress(): number {
    if (!this.vacancy || !this.applications.length) return 0;
    const progress = (this.applications.length / (this.vacancy.quota || 1)) * 100;
    return Math.min(progress, 100); // Cap at 100%
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVacancyDetails(id);
    } else {
      this.error = 'No vacancy ID provided';
      this.isLoading = false;
    }
  }

  private loadVacancyDetails(vacancyId: string): void {
    this.isLoading = true;
    this.vacancyService.getVacancyById(vacancyId).subscribe({
      next: (vacancy) => {
        this.vacancy = vacancy;
        this.loadApplications(vacancyId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vacancy:', error);
        this.error = 'Failed to load vacancy details';
        this.isLoading = false;
        this.snackBar.open('Failed to load vacancy details', 'Dismiss', { duration: 3000 });
      }
    });
  }

  private loadApplications(vacancyId: string): void {
    // In a real app, you would call the API to get applications for this vacancy
    // For now, we'll use an empty array
    this.applications = [];
    this.acceptedApplicationsCount = this.applications.filter(app => app.status === 'accepted').length;
    
    // This is a placeholder - replace with actual API call when available
    // this.vacancyService.getVacancyApplications(vacancyId).subscribe({
    //   next: (applications: Application[]) => {
    //     this.applications = applications;
    //     this.acceptedApplicationsCount = applications.filter(app => app.status === 'accepted').length;
    //   },
    //   error: (error) => {
    //     console.error('Error loading applications:', error);
    //     this.applications = [];
    //     this.snackBar.open('Failed to load applications', 'Dismiss', { duration: 3000 });
    //   }
    // });
  }

  getCandidateName(application: Application): string {
    if (!application?.candidate) return 'Unknown Candidate';
    // Using type assertion since we know the shape of the candidate object
    const candidate = application.candidate as { firstName?: string; lastName?: string };
    return `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-pending';
    
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
      default:
        return 'status-pending';
    }
  }

  viewCandidate(candidateId: string): void {
    this.router.navigate(['/candidates', candidateId]);
  }

  viewApplication(applicationId: string): void {
    this.router.navigate(['/applications', applicationId]);
  }

  getProgressPercentage(): number {
    if (!this.vacancy) return 0;
    const filled = this.acceptedApplicationsCount;
    const total = this.vacancy.quota || 1;
    return Math.min(Math.round((filled / total) * 100), 100);
  }

  goBack(): void {
    this.router.navigate(['/vacancies']);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected' | 'pending'): void {
    this.vacancyService.updateApplicationStatus(applicationId, status).subscribe({
      next: () => {
        const application = this.applications.find(app => app.id === applicationId);
        if (application) {
          application.status = status;
          this.snackBar.open(`Application ${status} successfully`, 'Close', {
            duration: 3000
          });
        }
      },
      error: (error: Error) => {
        console.error('Error updating application status:', error);
        this.snackBar.open('Failed to update application status', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
