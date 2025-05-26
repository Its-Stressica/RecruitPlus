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
import { Vacancy, Application, CandidateBasic } from '../../../models/vacancy.model';
import { Candidate } from '../../../models/candidate.model';

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
  selectedTab = 0; // Track the active tab index
  applications: Application[] = []; // Initialize as empty array to avoid null reference
  isLoading = true;
  displayedColumns: string[] = ['name', 'email', 'score', 'status', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
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
      // Handle error - no ID provided
      this.router.navigate(['/vacancies']);
    }
  }

  loadVacancyDetails(id: string): void {
    // In a real app, you would call your API service here
    // For now, we'll use mock data
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // Mock vacancy data with all required fields
      this.vacancy = {
        id,
        title: 'Senior Frontend Developer',
        slug: 'senior-frontend-developer',
        description: 'We are looking for an experienced Frontend Developer to join our team.',
        requirements: [
          '5+ years of experience with Angular',
          'Strong TypeScript skills',
          'Experience with state management (NgRx/NGXS)',
          'Knowledge of RxJS',
          'Experience with testing (Jest/Karma)'
        ],
        responsibilities: [
          'Develop new user-facing features',
          'Build reusable code and libraries',
          'Optimize application for maximum speed and scalability',
          'Collaborate with backend developers and web designers'
        ],
        department: 'Engineering',
        location: 'Kyiv, Ukraine',
        unit: 'Frontend Team',
        positionType: 'full-time',
        experienceLevel: 'senior',
        salaryRange: {
          min: 4000,
          max: 7000,
          currency: 'USD',
          isPublic: true
        },
        quota: 3,
        availablePositions: 2,
        startDate: new Date('2023-06-01'),
        deadline: new Date('2023-05-25'),
        isActive: true,
        isRemote: true,
        applicationCount: 2,
        tags: ['frontend', 'angular', 'typescript'],
        skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Jest'],
        benefits: ['Remote work', 'Flexible hours', 'Health insurance', 'Professional development'],
        createdBy: 'system',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-05-01'),
        applications: [
          {
            id: 'app1',
            candidateId: 'cand1',
            vacancyId: id,
            appliedAt: new Date('2023-05-15'),
            status: 'pending',
            score: 85,
            isChosenByAlgorithm: true,
            createdAt: new Date('2023-05-15'),
            updatedAt: new Date('2023-05-15'),
            candidate: {
              id: 'cand1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '+380501234567',
              score: 85
            }
          },
          {
            id: 'app2',
            candidateId: 'cand2',
            vacancyId: id,
            appliedAt: new Date('2023-05-16'),
            status: 'reviewed',
            score: 65,
            isChosenByAlgorithm: false,
            createdAt: new Date('2023-05-16'),
            updatedAt: new Date('2023-05-16'),
            candidate: {
              id: 'cand2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com',
              phone: '+380507654321',
              score: 65
            }
          }
        ]
      };
      
      // Set applications
      if (this.vacancy?.applications) {
        this.applications = this.vacancy.applications;
      }
      
      this.isLoading = false;
    }, 500);
  }

  getCandidateName(candidate: CandidateBasic | undefined): string {
    if (!candidate) return 'Unknown';
    return `${candidate.firstName} ${candidate.lastName}`;
  }

  getStatusClass(status: 'pending' | 'reviewed' | 'accepted' | 'rejected'): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewed':
        return 'status-reviewed';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        const _exhaustiveCheck: never = status;
        return '';
    }
  }

  viewCandidate(candidateId: string): void {
    this.router.navigate(['/candidates', candidateId]);
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
