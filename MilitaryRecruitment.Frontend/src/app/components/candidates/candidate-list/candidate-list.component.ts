import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  applicationDate: Date;
}

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './candidate-list.component.html',
  styleUrl: './candidate-list.component.scss'
})
export class CandidateListComponent {
  displayedColumns: string[] = ['name', 'email', 'status', 'applicationDate', 'actions'];
  candidates: Candidate[] = [];
  isLoading = false;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor() {
    // Initialize with sample data
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // Sample data - replace with actual API call
      this.candidates = Array.from({ length: 25 }, (_, i) => ({
        id: (i + 1).toString(),
        firstName: `Candidate ${i + 1}`,
        lastName: 'Doe',
        email: `candidate${i + 1}@example.com`,
        status: ['New', 'In Review', 'Interview', 'Hired', 'Rejected'][Math.floor(Math.random() * 5)],
        applicationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      }));
      
      this.totalItems = 100; // Total number of items from the server
      this.isLoading = false;
    }, 500);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCandidates();
  }

  viewCandidate(id: string): void {
    // Implement view functionality
    console.log('View candidate:', id);
  }

  editCandidate(id: string): void {
    // Implement edit functionality
    console.log('Edit candidate:', id);
  }

  addCandidate(): void {
    // Implement add functionality
    console.log('Add new candidate');
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'status-new';
      case 'in review':
        return 'status-in-review';
      case 'interview':
        return 'status-interview';
      case 'hired':
        return 'status-hired';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }
}
