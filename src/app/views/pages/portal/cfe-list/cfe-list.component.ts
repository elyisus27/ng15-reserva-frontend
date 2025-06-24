import { Component, OnInit, ViewChild } from '@angular/core';
import { CfeService } from '../../../../_services/cfe.service';
import { SmartDatatableComponent } from '../../../../avanza/components/smart-datatable/smart-datatable.component';
import { DataTableAction } from '../../../../avanza/components/smart-datatable/smart-datatable.interfaces';
import { environment } from '../../../../../environments/environment';





@Component({
  selector: 'app-cfe-list',
  templateUrl: './cfe-list.component.html',
  styleUrls: ['./cfe-list.component.scss']
})
export class CfeListComponent implements OnInit {
  @ViewChild(SmartDatatableComponent) table!: SmartDatatableComponent;

  isUpdatingBalance: boolean = false;
  isRegisteringContracts: boolean = false;
  isLoggingInTelegram: boolean = false; // Nueva flag para el botón de Telegram

  constructor(
    private cfesvc: CfeService
  ) { }

  ngOnInit(): void { }

  url = `${environment.API_URL}/cfe-contract/listPaginated`
  columns = [
    { name: 'contractId', title: 'Id', width: "20px" },
    { name: 'street', title: 'Calles', width: "80px" },
    { name: 'receiptDate', title: 'Recibos', width: "120px" },
    { name: 'billingPeriod', title: 'Facturacion', width: "180px" },
    { name: 'serviceNumber', title: '# Servicio', width: "120px" },
    { name: 'meterNumber', title: 'Medidor' },
    { name: 'paymentDueDate', title: 'Fecha de Pago' },
    { name: 'paymentStatus', title: 'Status Pago' },
    { name: 'total', title: 'Cantidad' },
    { name: 'updatedAt', title: 'Actualizado el' }
  ];

  actions: DataTableAction[] = [];

  onEdit(row: any) { console.log('Editando', row); }
  onDelete(row: any) { console.log('Eliminando', row); }
  edit(row: any) { }
  delete(row: any) { }
  toggle(row: any) { }
  handleClick(event: any) { console.log(event) }

  updateBalance(): void {
    this.isUpdatingBalance = true;
    this.cfesvc.getPublicContent().subscribe({
      next: (data: any) => {
        console.log('Datos de adeudos CFE recibidos:', data);
        if (this.table) { this.table.reload(); }
      },
      error: (error: any) => {
        console.error('Error al actualizar adeudos CFE:', error);
      },
      complete: () => {
        this.isUpdatingBalance = false;
      }
    });
  }

  registerContracts(): void {
    this.isRegisteringContracts = true;
    this.cfesvc.registerContracts().subscribe({
      next: (data: any) => {
        console.log('Respuesta de registro de contratos CFE:', data);
        if (this.table) { this.table.reload(); }
      },
      error: (error: any) => {
        console.error('Error al registrar contratos CFE:', error);
      },
      complete: () => {
        this.isRegisteringContracts = false;
      }
    });
  }

  // Nuevo método para simular el inicio de sesión en Telegram
  loginTelegram(): void {
    this.isLoggingInTelegram = true;
    this.cfesvc.initTelegram().subscribe({
      next: (data: any) => {
        console.log('Respuesta de registro de contratos CFE:', data);
        if (this.table) { this.table.reload(); }
      },
      error: (error: any) => {
        console.error('Error al registrar contratos CFE:', error);
      },
      complete: () => {
        this.isLoggingInTelegram = false;
      }
    });
  }
}
