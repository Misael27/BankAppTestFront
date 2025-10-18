import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../../../core/components/confirmation-dialog/confirmation-dialog';
import { AccountDto, AccountRequest } from '../../../core/dtos/account.dto';
import { AccountService } from '../../../core/services/account.service';
import { AccountDialog } from '../account-dialog/account-dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatMenuModule,
    MatDialogModule, MatSnackBarModule,
    MatInputModule, MatFormFieldModule
  ],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss'
})
export class AccountList implements OnInit {
  displayedColumns: string[] = ['number', 'clientName', 'type', 'initBalance', 'state', 'actions'];
  dataSource: AccountDto[] = [];

  private accountService = inject(AccountService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar cuentas.', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
      }
    });
  }

  openDialog(account?: AccountDto, viewMode: boolean = false): void {
    const dialogRef = this.dialog.open(AccountDialog, {
      width: '500px',
      data: account ? { ...account, viewMode } : undefined
    });

    dialogRef.afterClosed().subscribe((result: AccountRequest | null) => {
      if (!result) return;
      const accountId = account?.id;
      if (accountId) {
        this.handleUpdate(accountId, result);
      } else {
        this.handleCreate(result);
      }
    });
  }

  onCreate(): void {
    this.openDialog();
  }

  onEdit(account: AccountDto): void {
    this.openDialog(account);
  }

  onView(account: AccountDto): void {
    this.openDialog(account, true);
  }

  handleCreate(accountData: AccountRequest): void {
    this.accountService.createAccount(accountData).subscribe({
      next: () => {
        this.snackBar.open('Cuenta creada con éxito.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
        this.loadAccounts();
      },
      error: (err) => {
        this.snackBar.open(`Error al crear cuenta. ${err?.error?.detail ?? "Intente de nuevo"}`, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
      }
    });
  }

  handleUpdate(id: number, accountData: AccountRequest): void {
    this.accountService.updateAccount(id, accountData).subscribe({
      next: () => {
        this.snackBar.open('Cuenta actualizada con éxito.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
        this.loadAccounts();
      },
      error: (err) => {
        this.snackBar.open(`Error al actualizar cuenta. ${err?.error?.detail ?? "Intente de nuevo"}`, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
      }
    });
  }

  onDelete(account: AccountDto): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Está seguro que desea eliminar la cuenta ${account.number} del cliente ${account.clientName}?`,
        confirmText: 'Eliminar Cuenta'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.accountService.deleteAccount(account.id).subscribe({
          next: () => {
            this.snackBar.open(`Cuenta ${account.number} eliminada.`, 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
            this.loadAccounts();
          },
          error: (err) => {
            this.snackBar.open(`Error al eliminar cuenta. ${err?.error?.detail ?? "Intente de nuevo"}`, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
          }
        });
      }
    });
  }
}
