import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vacancy, VacancyListResponse } from '../../models/vacancy.model';
import { Candidate, Application } from '../../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockVacancies: Vacancy[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      slug: 'senior-frontend-developer',
      description: 'We are looking for an experienced Frontend Developer to join our team.',
      requirements: [
        '5+ years of experience with Angular',
        'Strong TypeScript knowledge',
        'Experience with state management (NgRx, Ngxs)',
        'Familiarity with RESTful APIs',
        'Understanding of CI/CD pipelines'
      ],
      responsibilities: [
        'Develop new user-facing features',
        'Build reusable code and libraries',
        'Optimize application for maximum speed and scalability',
        'Collaborate with back-end developers and web designers'
      ],
      department: 'Engineering',
      location: 'Kyiv',
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
      startDate: new Date('2025-07-01'),
      deadline: new Date('2025-06-15'),
      isActive: true,
      isRemote: true,
      applicationCount: 5,
      tags: ['angular', 'frontend', 'typescript'],
      skills: ['Angular', 'TypeScript', 'RxJS', 'HTML/CSS', 'REST APIs'],
      benefits: ['Remote work', 'Flexible hours', 'Healthcare', 'Professional development budget'],
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-05-20'),
      createdBy: 'system',
      updatedBy: 'admin'
    },
    {
      id: '2',
      title: 'DevOps Engineer',
      slug: 'devops-engineer',
      description: 'Join our team to build and maintain our cloud infrastructure.',
      requirements: [
        '3+ years of experience in DevOps',
        'Experience with AWS/GCP/Azure',
        'Kubernetes and Docker expertise',
        'CI/CD pipeline implementation',
        'Infrastructure as Code (Terraform)'
      ],
      responsibilities: [
        'Design and implement CI/CD pipelines',
        'Maintain cloud infrastructure',
        'Ensure system security',
        'Monitor system performance'
      ],
      department: 'Engineering',
      location: 'Lviv',
      unit: 'DevOps Team',
      positionType: 'full-time',
      experienceLevel: 'mid',
      salaryRange: {
        min: 3500,
        max: 5500,
        currency: 'USD',
        isPublic: true
      },
      quota: 2,
      availablePositions: 1,
      startDate: new Date('2025-06-15'),
      deadline: new Date('2025-05-30'),
      isActive: true,
      isRemote: true,
applicationCount: 3,
      tags: ['devops', 'cloud', 'kubernetes'],
      skills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform'],
      benefits: ['Remote work', 'Competitive salary', 'Hardware budget', 'Conference budget'],
      createdAt: new Date('2025-02-10'),
      updatedAt: new Date('2025-05-18'),
      createdBy: 'system',
      updatedBy: 'admin'
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      slug: 'ui-ux-designer',
      description: 'Looking for a creative UI/UX Designer to create amazing user experiences.',
      requirements: [
        '3+ years of UI/UX design experience',
        'Portfolio of design projects',
        'Knowledge of design tools (Figma, Sketch, Adobe XD)',
        'Understanding of front-end development',
        'Experience with user research'
      ],
      responsibilities: [
        'Create user flows and wireframes',
        'Design UI elements and prototypes',
        'Conduct user research',
        'Collaborate with product and engineering teams'
      ],
      department: 'Design',
      location: 'Odesa',
      unit: 'Design Team',
      positionType: 'full-time',
      experienceLevel: 'mid',
      salaryRange: {
        min: 2500,
        max: 4500,
        currency: 'USD',
        isPublic: true
      },
      quota: 1,
      availablePositions: 1,
      startDate: new Date('2025-06-01'),
      deadline: new Date('2025-05-20'),
      isActive: true,
      isRemote: true,
applicationCount: 2,
      tags: ['design', 'ui', 'ux'],
      skills: ['Figma', 'User Research', 'Prototyping', 'UI Design', 'UX Writing'],
      benefits: ['Remote work', 'Design tools provided', 'Creative freedom', 'Team retreats'],
      createdAt: new Date('2025-03-05'),
      updatedAt: new Date('2025-05-15'),
      createdBy: 'system',
      updatedBy: 'admin'
    }
  ];

  private mockCandidates: Candidate[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+380501234567',
      score: 85,
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-05-20'),
      applications: [
        {
          id: 'app1',
          candidateId: '1',
          vacancyId: '1',
          score: 95,
          isChosenByAlgorithm: true,
          status: 'reviewed',
          appliedAt: new Date('2025-05-01'),
          reviewedAt: new Date('2025-05-10'),
          notes: 'Strong candidate with relevant experience',
          createdAt: new Date('2025-05-10'),
          updatedAt: new Date('2025-05-10'),
          vacancy: {
            id: '1',
            title: 'Senior Frontend Developer',
            description: 'We are looking for an experienced Frontend Developer',
            quota: 3,
            createdAt: new Date('2025-01-15'),
            updatedAt: new Date('2025-05-20')
          }
        }
      ]
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+380507654321',
      score: 92,
      createdAt: new Date('2025-02-15'),
      updatedAt: new Date('2025-05-18'),
      applications: [
        {
          id: 'app2',
          candidateId: '2',
          vacancyId: '2',
          score: 92,
          isChosenByAlgorithm: true,
          status: 'accepted',
          appliedAt: new Date('2025-05-05'),
          reviewedAt: new Date('2025-05-10'),
          notes: 'Top candidate with excellent skills',
          createdAt: new Date('2025-05-10'),
          updatedAt: new Date('2025-05-10'),
          vacancy: {
            id: '2',
            title: 'DevOps Engineer',
            description: 'Join our team to build and maintain our cloud infrastructure',
            quota: 2,
            createdAt: new Date('2025-02-10'),
            updatedAt: new Date('2025-05-18')
          }
        },
        {
          id: 'app3',
          candidateId: '2',
          vacancyId: '1',
          score: 88,
          isChosenByAlgorithm: false,
          status: 'pending',
          appliedAt: new Date('2025-05-05'),
          notes: 'Good technical skills, needs cultural fit interview',
          createdAt: new Date('2025-05-12'),
          updatedAt: new Date('2025-05-12'),
          vacancy: {
            id: '1',
            title: 'Senior Frontend Developer',
            description: 'We are looking for an experienced Frontend Developer',
            quota: 3,
            createdAt: new Date('2025-01-15'),
            updatedAt: new Date('2025-05-20')
          }
        }
      ]
    },
    {
      id: '3',
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex.johnson@example.com',
      phone: '+380509876543',
      score: 78,
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-05-15'),
      applications: [
        {
          id: 'app3',
          candidateId: '1',
          vacancyId: '2',
          score: 92,
          isChosenByAlgorithm: true,
          status: 'accepted',
          appliedAt: new Date('2025-05-10'),
          reviewedAt: new Date('2025-05-15'),
          notes: 'Excellent candidate, ready for offer',
          createdAt: new Date('2025-05-18'),
          updatedAt: new Date('2025-05-18'),
          vacancy: {
            id: '2',
            title: 'Backend Developer',
            description: 'Looking for a skilled Backend Developer',
            quota: 2,
            createdAt: new Date('2025-02-10'),
            updatedAt: new Date('2025-05-18')
          }
        }
      ]
    }
  ];

  constructor() {}

  getVacancies(page: number = 1, pageSize: number = 10): Observable<VacancyListResponse> {
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = this.mockVacancies.slice(startIndex, startIndex + pageSize);
    
    return of({
      data: paginatedItems,
      total: this.mockVacancies.length,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(this.mockVacancies.length / pageSize)
    });
  }

  getVacancyById(id: string): Observable<Vacancy | undefined> {
    const vacancy = this.mockVacancies.find(v => v.id === id);
    return of(vacancy);
  }

  getApplicationsByVacancyId(vacancyId: string): any[] {
    // Flatten all applications from all candidates, filtering out undefined applications
    const allApplications = this.mockCandidates.flatMap(candidate => 
      (candidate.applications || []).map(app => ({
        ...app,
        status: app.status || 'pending',
        appliedAt: app.appliedAt || new Date(),
        reviewedAt: app.reviewedAt,
        notes: app.notes,
        candidate: {
          id: candidate.id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone,
          score: candidate.score
        }
      }))
    );
    
    // Filter applications for the specific vacancy
    return allApplications.filter(app => app.vacancyId === vacancyId);
  }

  // ===== Candidate Methods =====
  getCandidates(page: number = 1, pageSize: number = 10): Observable<{ data: Candidate[]; total: number }> {
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = this.mockCandidates.slice(startIndex, startIndex + pageSize);
    
    return of({
      data: paginatedItems,
      total: this.mockCandidates.length
    });
  }

  getCandidateById(id: string): Observable<Candidate | undefined> {
    const candidate = this.mockCandidates.find(c => c.id === id);
    return of(candidate);
  }

  getCandidateApplications(candidateId: string): Observable<Application[]> {
    const candidate = this.mockCandidates.find(c => c.id === candidateId);
    return of(candidate?.applications || []);
  }
}
