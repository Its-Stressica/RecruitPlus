import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})
export class ApplicationListComponent implements OnInit {
  isLoading = true;
  vacancyId: string = '';
  vacancyTitle: string = 'Vacancy';
  displayedColumns: string[] = ['candidate', 'score', 'status', 'appliedAt', 'actions'];
  applications: Application[] = [];
  // Optionally store a fallback for candidate names if needed
  // candidateNames: { [applicationId: string]: string } = {};

  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.vacancyId = this.route.snapshot.paramMap.get('id') || '';
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (!this.vacancyId) {
      this.errorMessage = 'No vacancy ID provided';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      this.isLoading = false;
      return;
    }

    // Get the applications for this vacancy
    this.applicationService.getApplications({ vacancyId: this.vacancyId }).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.errorMessage = 'Failed to load applications. Please try again later.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  viewApplication(applicationId: string): void {
    console.log('View application:', applicationId);
    const application = this.applications.find(app => app.id === applicationId);
    if (application) {
      this.router.navigate(['/applications', applicationId]);
    } else {
      this.snackBar.open('Application not found', 'Close', { duration: 3000 });
    }
  }

  reviewApplication(applicationId: string): void {
    // TODO: Implement application review functionality
    console.log('Review application:', applicationId);
    // This could open a dialog or navigate to a review page
  }

  downloadResume(applicationId: string): void {
    // Find the application to get the candidate's name for the filename
    const application = this.applications.find(app => app.id === applicationId);
    
    // Validate application data
    if (!application) {
      this.snackBar.open('Error: Application not found', 'Close', { duration: 5000 });
      return;
    }
    
    // Get candidate name from application properties
    const firstName = application.candidateFirstName || 'user';
    const lastName = application.candidateLastName || new Date().getTime().toString();
    const candidateName = `${firstName} ${lastName}`.trim();
    console.log('Candidate Name:', candidateName);

    // In a real application, this would call an API endpoint to get the resume
    console.log('Downloading resume for application:', applicationId);
    
    // Simulate API call with a timeout
    this.isLoading = true;
    
    // Use arrow function to maintain 'this' context
    const downloadWithRetry = (retryCount = 0) => {
      try {
        // Generate a safe filename
        const fileName = `resume_${firstName}_${lastName}.pdf`;
        
        // Create a mock file (in a real app, this would come from the API)
        const content = `Resume for ${firstName} ${lastName}\n\n` +
                      `Position: ${this.vacancyTitle}\n` +
                      `Application Date: ${new Date().toLocaleDateString()}\n\n` +
                      'This is a mock resume. In a production environment, ' +
                      'this would be the actual resume file uploaded by the candidate.';
        
        const blob = new Blob([content], { type: 'application/pdf' });
        
        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
        
        this.snackBar.open('Resume downloaded successfully', 'Close', { duration: 3000 });
      } catch (error) {
        console.error('Error downloading resume:', error);
        if (retryCount < 2) {
          // Retry up to 2 times
          console.log(`Retry ${retryCount + 1} for resume download`);
          setTimeout(() => downloadWithRetry(retryCount + 1), 500);
          return;
        }
        this.snackBar.open('Failed to download resume. Please try again.', 'Close', { duration: 5000 });
      } finally {
        this.isLoading = false;
      }
    };
    
    // Start the download process
    setTimeout(downloadWithRetry, 1000);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'accepted':
        return 'badge-accepted';
      case 'rejected':
        return 'badge-rejected';
      case 'reviewed':
        return 'badge-reviewed';
      default:
        return 'badge-pending';
    }
  }

  goBack(): void {
    this.router.navigate(['/vacancies', this.vacancyId]);
  }
}
