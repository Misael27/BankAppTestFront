import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ClientDto } from '../../../shared/dtos/client.dto';
import { ClientService } from '../../../shared/services/client.service';
import { ClientList } from './client-list';

const mockClients: ClientDto[] = [
  { id: 1, name: 'Juan Pérez', gender: 'M', birthdate: '2020-05-13', personId: '12345', address: 'Calle A', phone: '111', state: true },
  { id: 2, name: 'María Gómez', gender: 'F', birthdate: '2020-05-13', personId: '67890', address: 'Calle B', phone: '222', state: true },
];

class MockClientService {
  getAllClients = jasmine.createSpy('getAllClients').and.returnValue(of(mockClients));
  deleteClient = jasmine.createSpy('deleteClient').and.returnValue(of({}));
}

describe('ClientList - Integración de Carga', () => {
  let component: ClientList;
  let fixture: ComponentFixture<ClientList>;
  let clientService: MockClientService;
  let compiled: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClientList],
      providers: [
        { provide: ClientService, useClass: MockClientService },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(true) }) } },
        { provide: MatSnackBar, useValue: { open: () => of({}) } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientList);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService) as unknown as MockClientService;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a loadClients en ngOnInit y cargar los datos', () => {
    expect(clientService.getAllClients).toHaveBeenCalled();

    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].name).toBe('Juan Pérez');

    const rows = compiled.querySelectorAll('mat-row');
    expect(rows.length).toBe(2, 'Debe haber 2 filas de clientes en la tabla.');
    expect(rows[0].textContent).toContain('Juan Pérez');
  });
});

describe('ClientList - Integración de Búsqueda', () => {
  let component: ClientList;
  let fixture: ComponentFixture<ClientList>;
  let compiled: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClientList],
      providers: [
        { provide: ClientService, useClass: MockClientService },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(true) }) } },
        { provide: MatSnackBar, useValue: { open: () => of({}) } },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientList);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('debería filtrar la tabla por nombre cuando se escribe en el input', () => {
    expect(component.dataSource.length).toBe(2);
    let rows = compiled.querySelectorAll('mat-row');
    expect(rows.length).toBe(2);
    component.searchControl.setValue('juan');
    fixture.detectChanges();

    expect(component.dataSource.length).toBe(1, 'El filtro debe reducir la lista a 1 cliente.');
    expect(component.dataSource[0].name).toBe('Juan Pérez');

    rows = compiled.querySelectorAll('mat-row');
    expect(rows.length).toBe(1, 'La tabla HTML debe mostrar solo 1 fila después del filtro.');
    expect(rows[0].textContent).toContain('Juan Pérez');
  });

  it('debería restaurar la lista si el término de búsqueda se limpia', () => {
    component.searchControl.setValue('juan');
    fixture.detectChanges();
    expect(component.dataSource.length).toBe(1);

    component.searchControl.setValue('');
    fixture.detectChanges();

    expect(component.dataSource.length).toBe(2, 'La lista completa debe ser restaurada.');
    let rows = compiled.querySelectorAll('mat-row');
    expect(rows.length).toBe(2, 'La tabla HTML debe restaurar las 2 filas.');
  });
});