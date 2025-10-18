import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientDto } from '../../../core/dtos/client.dto';
import { MovementReportDto } from '../../../core/dtos/report.dto';
import { ClientService } from '../../../core/services/client.service';
import { ReportService } from '../../../core/services/report.service';

import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule,
    MatDividerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './report-list.html',
  styleUrl: './report-list.scss'
})
export class ReportList implements OnInit {
  reportForm!: FormGroup;
  displayedColumns: string[] = [
    'date', 'clientName', 'accountNumber', 'accountType',
    'initBalance', 'movement', 'finalBalance', 'accountState'
  ];
  dataSource: MovementReportDto[] = [];
  clients$!: Observable<ClientDto[]>;

  private reportService = inject(ReportService);
  private clientService = inject(ClientService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.clients$ = this.clientService.getAllClients().pipe(
      catchError(err => {
        this.snackBar.open('Error al cargar la lista de clientes.', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
        return EMPTY;
      })
    );

    this.reportForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      clientId: [null]
    });
  }

  generateReport(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const formValue = this.reportForm.value;

    const startDate = formValue.startDate.toISOString().substring(0, 10);
    const endDate = formValue.endDate.toISOString().substring(0, 10);

    const query = {
      startDate: startDate,
      endDate: endDate,
      clientId: formValue.clientId
    };

    this.reportService.getMovementReport(query).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.snackBar.open(`Reporte generado con ${data.length} registros.`, 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
      },
      error: (err) => {
        const errorDetail = err.error?.detail || 'Error al generar el reporte.';
        this.snackBar.open(errorDetail, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
        this.dataSource = [];
      }
    });
  }

  getMovementClass(movement: number): string {
    return movement > 0 ? 'credit' : (movement < 0 ? 'debit' : '');
  }
}
