import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Observable } from 'rxjs';
import { AccountDto, AccountRequest } from '../../../core/dtos/account.dto';
import { ClientDto } from '../../../core/dtos/client.dto';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-account-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatSlideToggleModule
  ],
  templateUrl: './account-dialog.html',
  styleUrl: './account-dialog.scss'
})
export class AccountDialog implements OnInit {
  accountForm!: FormGroup;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  title: string = 'Agregar Nueva Cuenta';
  accountTypes: string[] = ['Ahorros', 'Corriente'];
  clients$!: Observable<ClientDto[]>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccountDialog, AccountRequest | null>,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: AccountDto & { viewMode?: boolean }
  ) { }

  ngOnInit(): void {
    this.isViewMode = !!this.data?.viewMode;
    this.isEditMode = !!this.data && !this.isViewMode;

    // Cargar la lista de clientes
    this.clients$ = this.clientService.getAllClients();

    if (this.isViewMode) {
        this.title = 'Detalle de Cuenta';
    } else {
        this.title = this.isEditMode ? 'Editar Cuenta' : 'Agregar Nueva Cuenta';
    }

    this.accountForm = this.fb.group({
      number: [this.data?.number || '', [Validators.required, Validators.maxLength(50)]],
      type: [this.data?.type || this.accountTypes[0], Validators.required],
      initBalance: [this.data?.initBalance || 0, [Validators.required, Validators.min(0)]],
      clientId: [this.data?.clientId || '', Validators.required],
      state: [this.data?.state ?? true]
    });

    if (this.isEditMode) {
        this.accountForm.get('number')?.disable();
    }

    if (this.isViewMode) {
        this.accountForm.disable();
    }
  }

  onSave(): void {
    if (this.accountForm.valid) {
      this.dialogRef.close(this.accountForm.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
