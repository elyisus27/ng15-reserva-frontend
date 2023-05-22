import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'ls-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
	@Input() pageSize: number = 10;
	@Input() pageSizes: number[] = [10];
	@Input() dataCount: number;
	@Input() disabled: boolean = false;	
	
	@Output() pageChange = new EventEmitter();
	
	currentPage: number = 1;
	totalPages: number = 0;
	pageStart: number = 0;
	pageEnd: number = 0;

	pages: number[] = [1, 2, 3, 4, 5];

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		this.init();
	}

	init() {
		this.totalPages = Math.ceil(this.dataCount / this.pageSize);
		this.pageStart = ((this.currentPage - 1) * this.pageSize) + 1;
		this.pageEnd = (this.currentPage * this.pageSize) > this.dataCount ? this.dataCount : (this.currentPage * this.pageSize);
		
		this.pages = [];
		
		var start = Math.max(1, this.currentPage - 2);
		var end = Math.min(start + 4, this.totalPages);

		for (let page = start; page <= end; page++) {
			this.pages.push(page);
		}

		this.cdr.detectChanges();
	}

	goPage(page) {
		this.currentPage = page;
		
		this.pageChange.emit({ pageNum: this.currentPage, pageSize: this.pageSize });
	}

	firstPage() {
		this.currentPage = 1;
		this.pageChange.emit({ pageNum: this.currentPage, pageSize: this.pageSize });
	}

	prevPage() {
		this.currentPage--;
		this.pageChange.emit({ pageNum: this.currentPage, pageSize: this.pageSize });
	}

	nextPage() {
		this.currentPage++;
		this.pageChange.emit({ pageNum: this.currentPage, pageSize: this.pageSize });
	}

	lastPage() {
		this.currentPage = this.totalPages;
		this.pageChange.emit({ pageNum: this.currentPage, pageSize: this.pageSize });
	}

	changePageSize() {
		this.currentPage = 1;
		this.pageChange.emit({ pageNum: this.currentPage, pageSize: this.pageSize });
	}

	refresh() {
		this.pageChange.emit({ pageNum: this.currentPage, pageSize: this.pageSize });
	}
}
