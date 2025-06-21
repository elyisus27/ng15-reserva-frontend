import { Component, ViewChild } from '@angular/core';
import { DataTableAction } from '../../../../avanza/components/smart-datatable/smart-datatable.interfaces';
import { IconSubset } from '../../../../icons/icon-subset';
import { SmartDatatableComponent } from '../../../../avanza/components/smart-datatable/smart-datatable.component';
import { CfeService } from '../../../../_services/cfe.service';

@Component({
  selector: 'app-cfe-list',
  templateUrl: './cfe-list.component.html',
  styleUrls: ['./cfe-list.component.scss']
})


export class CfeListComponent {
  @ViewChild(SmartDatatableComponent) table!: SmartDatatableComponent;

  constructor(
    private cfesvc: CfeService
  ) { }

  ngOnInit() {
  }

  columns = [
    { name: 'contractId', title: 'Id', width: "20px" },
    { name: 'street', title: 'Calles', width: "80px" },
    { name: 'receiptDate', title: 'Recibos', width: "120px" },
    { name: 'billingPeriod', title: 'Facturacion', width: "120px" },
    //{ name: 'receiptMonths', title: 'Meses de Recibos' },
    { name: 'serviceNumber', title: '# Servicio' },
    { name: 'meterNumber', title: 'Medidor' },
    //{ name: 'clientName', title: 'Cliente' },
    { name: 'paymentDueDate', title: 'Fecha de Pago' },
    { name: 'paymentStatus', title: 'Status Pago' },
    { name: 'total', title: 'Cantidad' },
    { name: 'updatedAt', title: 'Actualizado el' }
  ];

  actions: DataTableAction[] = [
    // {
    //   icon: IconSubset.cilPencil,
    //   tooltip: 'Editar',
    //   //label: 'Editar',
    //   color: 'primary',
    //   fn: (row:any) => this.edit(row)
    // },
    // {
    //   icon: IconSubset.cilTrash,
    //   tooltip: 'Eliminar',
    //   //label: 'Eliminar',
    //   color: 'danger',
    //   fn: (row:any) => this.delete(row)
    // },
    // {
    //   icon: IconSubset.cilCheck,
    //   tooltip: 'Activar',
    //   //label: 'Activar',
    //   color: 'success',
    //   fn: (row:any) => this.toggle(row)
    // }
  ];

  onEdit(row: any) {
    console.log('Editando', row);
  }

  onDelete(row: any) {
    console.log('Eliminando', row);
  }

  edit(row: any) { }
  delete(row: any) { }
  toggle(row: any) { }

  handleClick(event: any) {
    console.log(event)
  }

  updateBalance() {

  }
}
