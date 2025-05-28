import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Vacancy, Application } from '../../../models/vacancy.model';
import { Candidate } from '../../../models/candidate.model';
import { MockDataService } from '../../../core/services/mock-data.service';

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
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ]
})
export class VacancyDetailsComponent implements OnInit {
  vacancy: Vacancy | null = null;
  selectedTab = 0;
  applications: Application[] = [];
  isLoading = true;
  error: string | null = null;
  displayedColumns: string[] = ['candidate', 'score', 'status', 'appliedAt', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private mockDataService: MockDataService
  ) {}

  getApplicationProgress(application: Application): number {
    if (!this.vacancy || !application) return 0;
    
    const totalPositions = this.vacancy.availablePositions || 1;
    const filledPositions = this.applications.filter(a => a.status === 'accepted').length;
    
    if (application.status === 'accepted') return 100;
    if (totalPositions - filledPositions <= 0) return 0;
    
    const progress = (filledPositions / totalPositions) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
  }

  getVacancyProgress(): number {
    if (!this.vacancy?.applications?.length || !this.vacancy.availablePositions) return 0;
    const progress = (this.vacancy.applications.length / this.vacancy.availablePositions) * 100;
    return Math.min(progress, 100); // Cap at 100%
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVacancyDetails(id);
    } else {
      this.error = 'No vacancy ID provided';
      this.isLoading = false;
      this.showError('No vacancy ID provided');
      this.router.navigate(['/vacancies']);
    }
  }

  loadVacancyDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    // Load vacancy details
    this.mockDataService.getVacancyById(id).subscribe({
      next: (vacancy) => {
        if (vacancy) {
          this.vacancy = vacancy;
          this.loadApplications(id);
        } else {
          this.error = 'Vacancy not found';
          this.isLoading = false;
          this.showError('Vacancy not found');
          this.router.navigate(['/vacancies']);
        }
      },
      error: (error) => {
        console.error('Error loading vacancy:', error);
        this.error = 'Failed to load vacancy details';
        this.isLoading = false;
        this.showError('Failed to load vacancy details');
      }
    });
  }

  private loadApplications(vacancyId: string): void {
    const applications = this.mockDataService.getApplicationsByVacancyId(vacancyId);
    this.applications = applications || [];
    this.isLoading = false;
  }

  getCandidateName(application: Application): string {
    if (!application?.candidate) return 'Unknown Candidate';
    return `${application.candidate.firstName || ''} ${application.candidate.lastName || ''}`.trim();
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
    const filled = this.applications.filter(a => a.status === 'accepted').length;
    const total = this.vacancy.availablePositions || 1;
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

  updateApplicationStatus(applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected'): void {
    // In a real app, you would call your API service here
    const application = this.applications.find(app => app.id === applicationId);
    if (application) {
      application.status = status;
      this.snackBar.open(`Application ${status}`, 'Close', {
        duration: 3000
      });
    }
  }
}
