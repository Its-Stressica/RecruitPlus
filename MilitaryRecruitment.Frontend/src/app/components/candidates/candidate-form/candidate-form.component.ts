import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { Candidate } from '../../../models/candidate.model';
import { Application, CandidateBasic } from '../../../models/vacancy.model';
import { VacancyGetDto } from '../../../models/vacancy.dto';

export interface VacancyOption {
  id: string;
  title: string;
  description: string;
}

interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vacancy: string;
  score: number;
}
import { VacancyService } from '../../../core/services/vacancy.service';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule
  ] as any[],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css']
})
export class CandidateFormComponent implements OnInit {
  candidateForm: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    phone: FormControl<string | null>;
    vacancy: FormControl<string | null>;
    score: FormControl<number | null>;
  }>;
  isSubmitting = false;
  isEditMode = false;
  vacancies: VacancyOption[] = [];
  scoreOptions = Array.from({length: 101}, (_, i) => i);

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private vacancyService: VacancyService,
    public dialogRef: MatDialogRef<CandidateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidate?: Candidate } = {}
  ) {
    this.candidateForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9+\-\s()]+$')
      ]],
      vacancy: ['', Validators.required],
      score: [null as number | null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadVacancies();
    if (this.data?.candidate) {
      this.isEditMode = true;
      this.candidateForm.patchValue({
        ...this.data.candidate,
        vacancy: this.data.candidate.applications?.[0]?.vacancy?.id || ''
      });
    }
  }

  isLoadingVacancies = false;

  loadVacancies(): void {
    this.isLoadingVacancies = true;
    this.vacancyService.getVacancies().subscribe({
      next: (vacancies: VacancyGetDto[]) => {
        this.vacancies = vacancies.map(v => ({
          id: v.id,
          title: v.title,
          description: v.description || 'No description available'
        }));
        
        // If in edit mode and we have a candidate with a vacancy, select it
        if (this.isEditMode && this.data?.candidate?.applications?.[0]?.vacancy?.id) {
          const vacancyId = this.data.candidate.applications[0].vacancy.id;
          if (this.vacancies.some(v => v.id === vacancyId)) {
            this.candidateForm.patchValue({
              vacancy: vacancyId,
              score: this.data.candidate.applications[0].score
            });
          }
        }
      },
      error: (error) => {
        console.error('Error loading vacancies:', error);
        this.snackBar.open('Failed to load vacancies. Please try again later.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.isLoadingVacancies = false;
      }
    });
  }

  onSubmit(): void {
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    const formValue = this.candidateForm.getRawValue() as CandidateFormData;
    const selectedVacancy = this.vacancies.find(v => v.id === formValue.vacancy);
    
    if (!selectedVacancy) {
      this.snackBar.open('Please select a valid vacancy', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const application: Application = {
      id: Math.random().toString(36).substr(2, 9),
      candidateId: this.isEditMode && this.data.candidate ? this.data.candidate.id : '',
      vacancyId: selectedVacancy.id,
      score: formValue.score,
      isChosenByAlgorithm: false,
      status: 'pending',
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      candidate: {
        id: this.isEditMode && this.data.candidate ? this.data.candidate.id : '',
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        score: formValue.score
      }
    };

    const candidate: CandidateBasic = {
      id: this.isEditMode && this.data.candidate ? this.data.candidate.id : Math.random().toString(36).substr(2, 9),
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      score: formValue.score
    };
    
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.dialogRef.close({
        candidate,
        application
      });
    }, 1000);
  }

  onCancel(): void {
    if (this.candidateForm.dirty) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  // Form control getters for easy access in template
  get firstName() { return this.candidateForm.get('firstName')!; }
  get lastName() { return this.candidateForm.get('lastName')!; }
  get email() { return this.candidateForm.get('email')!; }
  get phone() { return this.candidateForm.get('phone')!; }
  get vacancy() { return this.candidateForm.get('vacancy')!; }
  get score() { return this.candidateForm.get('score')!; }
}
