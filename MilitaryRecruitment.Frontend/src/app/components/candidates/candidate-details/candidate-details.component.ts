import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Candidate } from '../../../models/candidate.model';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './candidate-details.component.html',
  styleUrl: './candidate-details.component.css'
})
export class CandidateDetailsComponent implements OnInit {
  candidate: Candidate | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCandidate();
  }

  loadCandidate(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No candidate ID provided';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.mockDataService.getCandidateById(id).subscribe({
      next: (candidate) => {
        if (candidate) {
          this.candidate = candidate;
        } else {
          this.error = 'Candidate not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load candidate details';
        this.isLoading = false;
        this.snackBar.open('Failed to load candidate details', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/candidates']);
  }
}
