import { AfterViewInit, Component, Input } from '@angular/core';
import { PaginationComponent } from '@coreui/angular';

@Component({
  selector: 'av-datatable',
  templateUrl: './avdatatable.component.html',
  styleUrls: ['./avdatatable.component.scss']
})
export class AvdatatableComponent implements AfterViewInit {
  // @ViewChild('container', { static: false }) containerEl: ElementRef | undefined ;

  // @ViewChild('bodyContainer', { static: false })
  // containerBodyEl!: ElementRef;
  // @ViewChild('bodyTable', { static: false })
  // tableBodyEl!: ElementRef;

  // @ViewChild(PaginationComponent, { static: false })
  //pager!: PaginationComponent;

  // @ViewChildren('ButtonComponent') listItems:any;

  // Table Columns
  @Input() columns: DataTableColumn[] = [];

  // @Input() delay: number = 500;

  // @Input() pagination: boolean = true;
  // @Input() pageSize: number = 10;
  // @Input() pageSizeOpts: number[] = [10, 25, 50];

  // @Input() url: string = '';

  @Input() buttons: DataTableButton[] = [];
  // @Input() actions: DataTableButton[] = [];

  // @Input() multiselect: boolean = false;
  @Input() relative: boolean = false;
  // @Input() filters: any = {};

  @Input() remote: boolean = true;
  // @Input() data: any[] = [];
  @Input() sort: DataTableSort[] = [];

  // @Output() select = new EventEmitter();
  // @Output() rowdblclick = new EventEmitter();

  //selection!: any[];

  // Operational
  public columnsWidth: number[] = [];
  //private pageNum: number = 1;
  //private itemFocused: number = 0;
  //private filter: string = '';
  public loading: boolean = true;
  //private haveScroll: boolean = false;
  //private sortCol!: { column: string; direction: number; };

  dataCount: number = 0;
  tmpData: any[] = [];
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  btnClicked(b: DataTableButton) {
    b.fn();
  }
  // sortColumn(column:any) {
	// 	if (this.sort[0].column === column) {
	// 		this.sort[0].direction = this.sort[0].direction * -1;
	// 	} else {
	// 		this.sort[0] = { column, direction: 1 }
	// 	}

	// 	this.pager.currentPage = 1;

	// 	this.refresh();
	// }
  // columnSorted(name: string) {
	// 	return this.sort.findIndex((c) => c.column === name) >= 0;
	// }
  

}

export interface DataTableColumn {
  name: string;
  title: string;
  width: number;

  template?: (data: any) => string;
  align?: string;
  titleAlign?: string;
  nullReplace?: string;
  filterIgnore?: boolean;
}

export interface DataTableSort {
  column: string;
  direction: number;
}

export interface DataTableButton {
  text: string;
  icon?: string;
  tooltip?: string;
  class?: string;
  scope?: any;
  permission?: string;

  fn(data?: any): void;
  hide?: (data?: any) => boolean;
}
