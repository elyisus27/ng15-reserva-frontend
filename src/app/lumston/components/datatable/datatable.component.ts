import { Component, ViewChild, AfterViewInit, ElementRef, ViewChildren, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { PaginationComponent } from '../pagination/pagination.component';
import Swal from 'sweetalert2';


@Component({
	selector: 'ls-datatable',
	templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatatableComponent implements AfterViewInit {
    @ViewChild('container', { static: false }) containerEl: ElementRef | undefined ;
	
    @ViewChild('bodyContainer', { static: false })
	containerBodyEl!: ElementRef;
	@ViewChild('bodyTable', { static: false })
	tableBodyEl!: ElementRef;
	
	@ViewChild(PaginationComponent, { static: false })
	pager!: PaginationComponent;
    
	@ViewChildren('ButtonComponent') listItems:any;
    
    // Table Columns
	@Input() columns: DataTableColumn[] = [];

	@Input() delay: number = 500;

	@Input() pagination: boolean = true;
	@Input() pageSize: number = 10;
	@Input() pageSizeOpts: number[] = [10, 25, 50];

	@Input() url: string = '';

	@Input() buttons: DataTableButton[] = [];
	@Input() actions: DataTableButton[] = [];

	@Input() multiselect: boolean = false;
	@Input() relative: boolean = false;
	@Input() filters: any = {};

	@Input() remote: boolean = true;
	@Input() data: any[] = [];
	@Input() sort: DataTableSort[] = [];
	
	@Output() select = new EventEmitter();
	@Output() rowdblclick = new EventEmitter();

	selection!: any[];

    // Operational
    private columnsWidth: number[] = [];
	private pageNum: number = 1;
	private itemFocused: number = 0;
    private filter: string = '';
	private loading: boolean = true;
	private haveScroll: boolean = false;
	private sortCol!: { column: string; direction: number; };

	dataCount: number = 0;
    tmpData: any[] = [];

	private isReady = false;
	private filterHandler: string | number | NodeJS.Timeout | undefined;

	constructor(
		private http: HttpClient,
		private cdr: ChangeDetectorRef
    ) {}
    
    ngAfterViewInit() {
		setTimeout(() => {
			this.isReady = true;			

			this.sortCol = {
				column: this.columns[0].name,
				direction: 1,
			};
			this.loading = true;

			this.refresh();
		}, 50);
    }

	btnClicked(b: DataTableButton) {
		b.fn();
	}

	actionClicked(event: MouseEvent, b: DataTableButton, data: any, index: any) {
		event.stopPropagation();
		
		data['index'] = index;
		b.fn(data);
	}

	actionHide(b: DataTableButton, data: any) {
		if (b.hide) {
			return b.hide(data);
		} else {
			return false;
		}
	}

	// trDblClicked(data: any, index: number) {
	// 	event.stopPropagation();

	// 	data['index'] = index;
	// 	this.rowdblclick.emit(data);
	// }

	pageChanged(pageOptions: {pageNum: number, pageSize: number}) {
		this.pageNum = pageOptions.pageNum;
		this.pageSize = pageOptions.pageSize;

		this.refresh();
	}

	// filterKeyUp(e) {
	// 	if (e.which !== 0 && e.charCode !== 0) {
	// 		return;
	// 	}

	// 	clearTimeout(this.filterHandler);

	// 	if (e.key === 'Enter') {
	// 		this.filterData(e);
	// 		return;
	// 	}

	// 	this.filterHandler = setTimeout(() => {
	// 		this.filterData(e);
	// 	}, 500);
	// }

	// filterData(e) {
	// 	this.pager.currentPage = 1;

	// 	this.refresh();
	// }

	// sortColumn(column) {
	// 	if (this.sort[0].column === column) {
	// 		this.sort[0].direction = this.sort[0].direction * -1;
	// 	} else {
	// 		this.sort[0] = { column, direction: 1 }
	// 	}

	// 	this.pager.currentPage = 1;

	// 	this.refresh();
	// }

	selectRow(event: MouseEvent, idx: number) {
        if (event.ctrlKey) {
            const idxSel = this.selection.indexOf(idx);

            if (idxSel < 0) {
                this.selection.push(idx);
            } else {
                this.selection.splice(idxSel, 1);
            }
        // } else if (event.shiftKey) {

        } else {
            this.selection = [ idx ];
		}
		
		this.select.emit();
	}
	
	// getSelection(): any[] {
	// 	const selection = [];

	// 	this.selection.forEach((idx) => {
	// 		selection.push(this.tmpData[idx]);
	// 	});

	// 	return selection;
	// }

	refresh(reset?:any) {
		if (this.isReady !== true) {
			return;
		}

		if (reset) {
			this.pager.currentPage = 1;

			this.sortCol = {
				column: this.columns[0].name,
				direction: 1,
			};
		}

		this.selection = [];

        if (this.remote) {
            this.getData();
        } else {
            this.loadData();
        }
	}

	async getData() {
		this.loading = true;
		
		let timeOut = new Promise(resolve => {
			setTimeout(() => { resolve(true); }, 50); 
		});

		await timeOut;
		this.cdr.detectChanges();				

			
		const href = environment.API_URL;
		const requestUrl =  `${href}${this.url}`;
		
		const filters: any = {};

		this.columns.filter(c => !c.filterIgnore).forEach((c) => {
			filters[c.name] = this.filter;
		});

		if (this.sort.length === 0) {
			this.sort.push({column: this.columns[0].name, direction: 1});
		}

		// const mergeSort = [].concat(this.sort.map((i) => ({ column: i.column, direction: i.direction > 0 ? 'ASC' : 'DESC' })));

		const params: HttpParams = new HttpParams()
			.set('limit', this.pageSize.toString())
			.set('page', (this.pageNum).toString())
			//.set('sort', JSON.stringify(mergeSort))
			.set('filter', JSON.stringify({ generals: filters, others: this.filters }));
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
		};
		
		this.http.get(requestUrl, options).subscribe((response: any) => {
			if (response.success) {
				this.data = response.data.items;
				this.dataCount = response.data.totalItems;
			} else {
				Swal.fire({
					title: 'ERROR',
					text: 'Ocurrió un error al intentar obtener los datos del servidor',
					icon: 'error',
				});
				this.data = [];
				this.dataCount = 0;
			}
				
			setTimeout(async () => {
				this.loading = false;
							
				await timeOut;
				this.loadData();
			}, 50);
        }, (error: any) => {
            setTimeout(async () => {
				this.loading = false;

				await timeOut; 
				this.loadData();
			}, 50);
        });
	}  
	
	loadData() {
        if (!this.remote) {
			this.dataCount = this.data.length;
			
			this.tmpData = this.data.filter(() => true);
			this.tmpData.sort((a, b) => {
				let sortDif = 1;

				if (this.sortCol.direction > 0) {
					sortDif = a[this.sortCol.column] > b[this.sortCol.column] ? 1 : -1;
				} else {
					sortDif = b[this.sortCol.column] - a[this.sortCol.column] ? 1 : -1;
				}

				return sortDif;
			});

            this.tmpData = this.tmpData.filter((val, idx, arr) => {
                return idx >= ((this.pageNum - 1) * this.pageSize) &&  idx < ((this.pageNum * this.pageSize) -1);
            });
        } else {
            this.tmpData = this.data;
        }

        setTimeout(() => {
			this.loading = false;
			this.cdr.detectChanges();				
			this.getColumnsWidth();
        }, 50);
    }
    
    getColumnsWidth() {
		if ((this.data || []).length === 0) {
			setTimeout(() => {
				// this.pager.init();
				this.cdr.detectChanges();				
			}, 0);

			return;	
		}
		this.cdr.detectChanges();				

        const TBL_FIRST_ROW = this.tableBodyEl.nativeElement.getElementsByTagName('tr')[0];
        const TBL_COLS = (TBL_FIRST_ROW.children || []);

		this.columnsWidth = [];
		
		
		// window['tableBody'] = {
		// 	table: this.tableBodyEl,
		// 	container: this.containerBodyEl
		// };

		this.haveScroll = 
			this.containerBodyEl.nativeElement.offsetHeight - this.tableBodyEl.nativeElement.offsetHeight < 0;

		let firstCol = this.multiselect ? 1 : 0;
        for(let col = firstCol; col < TBL_COLS.length; col++)  {
            this.columnsWidth[this.multiselect ? col - 1 : col] = TBL_COLS[col].offsetWidth;
		}
		
		this.pager.init();



		setTimeout(() => {
			this.cdr.detectChanges();				
		}, 0);
    }

	setFocus() {
		this.listItems.first.setFocus();
	}

	onFocus(idx:any) {
		this.itemFocused = idx;
	}

	onKeyDown(e:any) {
		e.stopPropagation();
		if (e.key === 'ArrowDown') {
			this.nextItem();
		} else if (e.key === 'ArrowUp') {
			this.prevItem();
		}
	}

	nextItem() {
		this.itemFocused++;

		if (this.itemFocused >= this.listItems.length) {
			this.itemFocused = 0;
		}
	}

	prevItem() {
		this.itemFocused--;

		if (this.itemFocused < 0) {
			this.itemFocused = this.listItems.length - 1;
		}


		this.listItems.find((item: any, index: number) => index === this.itemFocused).setFocus();
	}

	private getColumnTpl(item:any, column:any) {
		if (column.template === undefined) {
			const value = item[column.name] || column.nullReplace || '-';
			return `${value}`;
		} else {
			return column.template(item);
		}
	}

	columnSorted(name: string) {
		return this.sort.findIndex((c) => c.column === name) >= 0;
	}

	columnSortedDirection(name: string) {
		return (this.sort.find((c) => c.column === name) || { direction: 0 }).direction;
	}
}

export interface DataTableColumn {
	name: string;
	title: string;
	width: number;

	template ? : (data: any) => string;
	align ? : string;
	titleAlign ? : string;
	nullReplace ? : string;
	filterIgnore ? : boolean;
}

export interface DataTableSort {
	column: string;
	direction: number;
}

export interface DataTableButton {
	text: string;
	icon ? : string;
	tooltip ? : string;
	class ? : string;
	scope ? : any;
	permission ? : string;

	fn(data ? : any): void;
	hide?: (data ? : any) => boolean;
}
