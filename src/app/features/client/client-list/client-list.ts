import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../../../core/components/confirmation-dialog/confirmation-dialog';
import { ClientDto } from '../../../core/dtos/client.dto';
import { ClientService } from '../../../core/services/client.service';
import { ClientDialog } from '../client-dialog/client-dialog';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss'
})
export class ClientList {
  displayedColumns: string[] = ['name', 'personId', 'gender', 'phone', 'state', 'actions'];

  dataSource: ClientDto[] = [];

 constructor(
    private clientService: ClientService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.dataSource = clients;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  openClientDialog(client?: ClientDto): void {
    const dialogRef = this.dialog.open(ClientDialog, {
      width: '500px',
      data: client ? { ...client } : null
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData) {
        if (client) {
          this.handleUpdate(client.id, formData);
        } else {
          this.handleCreate(formData);
        }
      }
    });
  }

  handleCreate(clientData: any): void {
    this.clientService.createClient(clientData).subscribe({
      next: (newClient) => {
        this.snackBar.open(`Cliente ${newClient.name} creado con éxito.`, 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.loadClients();
      },
      error: (err) => {
        this.snackBar.open(`Error al actualizar cliente. ${err?.error?.detail ?? "Intente de nuevo"}`, 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  handleUpdate(id: number, clientData: any): void {
    const updateDto = { ...clientData, id: undefined };
    this.clientService.updateClient(id, updateDto).subscribe({
      next: () => {
        this.snackBar.open('Cliente actualizado con éxito.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.loadClients();
      },
      error: (err) => {
        this.snackBar.open(`Error al actualizar cliente. ${err?.error?.detail ?? ""}`, 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  onView(client: ClientDto) {
    this.dialog.open(ClientDialog, {
      width: '500px',
      data: { ...client, viewMode: true }
    });
  }

  onEdit(client: ClientDto) {
    this.openClientDialog(client);
  }

  onAddClient() {
    this.openClientDialog();
  }

  onDelete(client: ClientDto) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Confirma eliminar cliente ${client.name}?`,
        confirmText: 'Eliminar Cliente'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.clientService.deleteClient(client.id).subscribe({
          next: () => {
            this.snackBar.open(`Cliente ${client.name} eliminado.`, 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.loadClients();
          },
          error: (err) => {
            this.snackBar.open(`Error al eliminar cliente. ${err?.error?.detail ?? ""}`, 'Cerrar', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }
}
