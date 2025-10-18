import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClientDto } from '../../../core/dtos/client.dto';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  templateUrl: './client-dialog.html',
  styleUrls: ['./client-dialog.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ]
})
export class ClientDialog implements OnInit {
  clientForm!: FormGroup;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  title: string = 'Agregar Nuevo Cliente';
  genders: string[] = ['M', 'F', 'Otro'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ClientDto & { viewMode?: boolean }
  ) { }

  ngOnInit(): void {
    this.isViewMode = !!this.data?.viewMode;
    this.isEditMode = !!this.data && !this.isViewMode;

    if (this.isViewMode) {
        this.title = 'Detalle del Cliente';
    } else {
        this.title = this.isEditMode ? 'Editar Cliente' : 'Agregar Nuevo Cliente';
    }

    this.clientForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      gender: [this.data?.gender || 'M', Validators.required],
      personId: [this.data?.personId || '', [Validators.required, Validators.pattern(/^\d+$/)]],
      address: [this.data?.address || '', Validators.required],
      phone: [this.data?.phone || '', Validators.required],
      password: ['', (this.isEditMode || this.isViewMode) ? [] : Validators.required],
      state: [this.data?.state ?? true]
    });

    if (this.isEditMode) {
        this.clientForm.get('personId')?.disable();
    }
    if (this.isViewMode) {
        this.clientForm.disable();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.clientForm.valid) {
      this.dialogRef.close(this.clientForm.getRawValue());
    }
  }
}