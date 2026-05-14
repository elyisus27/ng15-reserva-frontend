import { Component, OnInit, ViewChild } from '@angular/core';
import { CfeService } from '../../../../_services/cfe.service';
import { SmartDatatableComponent } from '../../../../avanza/components/smart-datatable/smart-datatable.component';
import { DataTableAction, DataTableColumn } from '../../../../avanza/components/smart-datatable/smart-datatable.interfaces';
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
  columns: DataTableColumn[] = [
    //{ name: 'contractId',     title: 'Id',            width: "20px" },
    { name: 'street',         title: 'Calle',         width: "160px" },
    { name: 'receiptDate',    title: 'Recibos',       width: "100px" },
    { name: 'billingPeriod',  title: 'Facturacion',   width: "150px" },
    { name: 'serviceNumber',  title: '# Servicio',    width: "120px" },
    { name: 'meterNumber',    title: 'Medidor',       width: "100px" },   
    { name: 'paymentDueDate', title: 'Fecha de Pago', width: "100px" },
    { name: 'paymentStatus',  title: 'Estatus',       width: "90px" },
    { name: 'total',          title: 'Total a pagar', width: "110px" },
    { name: 'updatedAt',      title: 'Actualizado',   width: "120px" }
  ];

  printColumns: DataTableColumn[] = [
    { name: 'contractId',     title: 'Id',            width: "4%", template: row => row.contractId ?? row.id ?? '' },
    { name: 'street',         title: 'Calles',        width: "13%" },
    // { name: 'receiptDate',    title: 'Recibos',       width: "10%" },
    { name: 'billingPeriod',  title: 'Facturacion',   width: "19%" },
    { name: 'serviceNumber',  title: '# Servicio',    width: "13%" },
    { name: 'meterNumber',    title: 'Medidor',       width: "9%" },
    { name: 'paymentDueDate', title: 'Fecha de Pago', width: "12%", template: row => this.formatPrintDate(row.paymentDueDate) },
    { name: 'paymentStatus',  title: 'Status Pago',   width: "9%" },
    { name: 'total',          title: 'Cantidad',      width: "11%", template: row => this.formatPrintAmount(row.total) }
  ];

  actions: DataTableAction[] = [];

  onEdit(row: any) { console.log('Editando', row); }
  onDelete(row: any) { console.log('Eliminando', row); }
  edit(row: any) { }
  delete(row: any) { }
  toggle(row: any) { }
  handleClick(event: any) { console.log(event) }

  printReceipts(): void {
    window.print();
  }

  private formatPrintDate(value: any): string {
    if (!value) return '';

    if (typeof value === 'number' || /^\d+$/.test(value)) {
      value = Number(value);
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      excelEpoch.setUTCDate(excelEpoch.getUTCDate() + value);
      return excelEpoch.toLocaleDateString('es-MX');
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('es-MX');
  }

  private formatPrintAmount(value: any): string {
    if (value === null || value === undefined || value === '') return '';

    const amount = Number(value);
    if (Number.isNaN(amount)) return value;

    return amount.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    });
  }

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
