import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { MovementDto, MovementRequest } from '../../../shared/dtos/movement.dto';
import { MovementService } from '../../../shared/services/movement.service';
import { MovementDialog } from '../movement-dialog/movement-dialog';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  providers: [DatePipe],
  templateUrl: './movement-list.html',
  styleUrl: './movement-list.scss'
})
export class MovementList implements OnInit {
  displayedColumns: string[] = ['date', 'accountNumber', 'type', 'value', 'balance', 'actions'];
  dataSource: MovementDto[] = [];

  private fullMovementList: MovementDto[] = [];
  searchControl = new FormControl('');

  private movementService = inject(MovementService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadMovements();
    this.searchControl.valueChanges.subscribe(searchTerm => {
      this.applyFilter(searchTerm || '');
    });
  }

  loadMovements(): void {
    this.movementService.getMovements().subscribe({
      next: (data) => {
        this.fullMovementList = data;
        this.dataSource = data;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar movimientos.', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
        console.error('Error al cargar movimientos:', err);
      }
    });
  }

  applyFilter(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.dataSource = this.fullMovementList;
      return;
    }
    const lowerCaseTerm = searchTerm.toLowerCase().trim();
    this.dataSource = this.fullMovementList.filter(movement =>
      movement.accountNumber?.toLowerCase().includes(lowerCaseTerm)
    );
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(MovementDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: MovementRequest | null) => {
      if (result) {
        this.handleCreate(result);
      }
    });
  }

  onView(movement: MovementDto): void {
    this.dialog.open(MovementDialog, {
      width: '500px',
      data: { ...movement, viewMode: true }
    });
  }

  handleCreate(movementData: MovementRequest): void {
    this.movementService.createMovement(movementData).subscribe({
      next: () => {
        this.snackBar.open('Movimiento registrado con éxito.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
        this.loadMovements();
      },
      error: (err) => {
        const errorDetail = err.error?.detail || 'Saldo insuficiente o cuenta no válida.';
        this.snackBar.open(`Error al crear movimiento: ${errorDetail}`, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
      }
    });
  }

  onDelete(movement: MovementDto): void {

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Está seguro de que desea eliminar el movimiento de ${movement.value} (${movement.type})? Esto podría afectar los saldos futuros.`,
        confirmText: 'Eliminar Movimiento'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.movementService.deleteMovement(movement.id).subscribe({
          next: () => {
            this.snackBar.open('Movimiento eliminado.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
            this.loadMovements();
          },
          error: (err) => {
            this.snackBar.open('Error al eliminar movimiento.', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
          }
        });
      }
    });
  }
}