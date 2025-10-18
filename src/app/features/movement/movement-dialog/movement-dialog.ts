import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AccountDto } from '../../../core/dtos/account.dto';
import { MovementDto, MovementRequest } from '../../../core/dtos/movement.dto';
import { AccountService } from '../../../core/services/account.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-movement-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatDividerModule, MatIconModule
  ],
  templateUrl: './movement-dialog.html',
  styleUrl: './movement-dialog.scss'
})
export class MovementDialog implements OnInit {
  movementForm!: FormGroup;
  isViewMode: boolean = false;
  title: string = 'Registrar Nuevo Movimiento';
  movementTypes: string[] = ['Retiro', 'Deposito'];
  accounts$!: Observable<AccountDto[]>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MovementDialog, MovementRequest | null>,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: MovementDto & { viewMode?: boolean }
  ) { }

  ngOnInit(): void {
    this.isViewMode = !!this.data?.viewMode;
    this.title = this.isViewMode ? 'Detalle del Movimiento' : 'Registrar Nuevo Movimiento';

    this.accounts$ = this.accountService.getAccounts();

    this.movementForm = this.fb.group({
      accountId: [this.data?.accountId || '', Validators.required],
      type: [this.data?.type || this.movementTypes[0], Validators.required],
      value: [this.data?.value || 0, [Validators.required, Validators.min(0.01)]],
    });

    if (this.isViewMode) {
      this.movementForm.addControl('date', this.fb.control(this.data?.date));
      this.movementForm.addControl('balance', this.fb.control(this.data?.balance));
      this.movementForm.disable();
    }
  }

  onSave(): void {
    if (this.movementForm.valid && !this.isViewMode) {
      this.dialogRef.close(this.movementForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
