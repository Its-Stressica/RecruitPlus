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
import { VacancyService } from '../../../core/services/vacancy.service';
import { CandidateService } from '../../../core/services/candidate.service';
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
  vacancyQuota: number = 0;
  private totalCandidates: number = 0;
  displayedColumns: string[] = ['candidate', 'score', 'status', 'appliedAt', 'actions'];
  applications: Application[] = [];
  showSelectionStatus = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private vacancyService: VacancyService,
    private candidateService: CandidateService,
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

    console.log('Loading applications for vacancy:', this.vacancyId);
    
    // First, get the vacancy details to get the quota
    this.applicationService.getVacancyDetails(this.vacancyId).subscribe({
      next: (vacancy: any) => {
        this.vacancyTitle = vacancy.title;
        this.vacancyQuota = vacancy.quota || 0;
        
        // Then get the applications for this vacancy
        this.loadVacancyApplications();
      },
      error: (error) => {
        console.error('Error loading vacancy details:', error);
        this.errorMessage = 'Failed to load vacancy details';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  private loadVacancyApplications(): void {
    this.isLoading = true;
    
  // First, get all candidates to get the total count
  this.candidateService.getCandidates().subscribe({
    next: (response: any) => {
      this.totalCandidates = response.total || 0;
      
      // Then get all vacancies to calculate total quota
    this.vacancyService.getVacancies().subscribe({
      next: (vacancies: any[]) => {
        // Sum up all quotas from all vacancies
        const totalQuota = vacancies.reduce((sum: number, vacancy: any) => sum + (vacancy.quota || 0), 0);
        console.log('Total quota across all vacancies:', totalQuota);
        
        // Now get the applications for the current vacancy
        this.applicationService.getApplications({ vacancyId: this.vacancyId }).subscribe({
          next: (applications: any[]) => {
            console.log('Received applications:', applications);
            this.applications = applications;
            
            // Check selection status based on total quota and selected candidates
            const selectedCount = this.applications.filter((app: any) => app.isChosenByAlgorithm).length;
            
            // Use the total quota across all vacancies as the maximum possible selections
            const maxPossibleSelections = Math.min(this.totalCandidates, totalQuota);
            
            // Show selection status if we have candidates and a valid quota
            this.showSelectionStatus = selectedCount == maxPossibleSelections;
            
            console.log('Raw applications from API:', JSON.stringify(applications, null, 2));

            // And add this after setting this.applications
            console.log('Processed applications:', this.applications.map(app => ({
              id: app.id,
              isChosenByAlgorithm: app.isChosenByAlgorithm,
              wasFullyCheckedByAlgorithm: app.wasFullyCheckedByAlgorithm,
              type: typeof app.isChosenByAlgorithm
            })));
            
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error loading applications:', error);
            this.errorMessage = 'Failed to load applications';
            this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
            this.isLoading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading vacancies:', error);
        this.errorMessage = 'Failed to load vacancy information';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  },
  error: (error: any) => {
    console.error('Error loading candidates:', error);
    this.errorMessage = 'Failed to load candidate information';
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
