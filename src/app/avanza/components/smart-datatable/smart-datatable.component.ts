import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { DataTableColumn, DataTableResponse, DataTableAction } from './smart-datatable.interfaces';

@Component({
  selector: 'smart-datatable',
  templateUrl: './smart-datatable.component.html',
  styleUrls: ['./smart-datatable.component.scss']
})
export class SmartDatatableComponent implements OnInit {

  @Input() columns: DataTableColumn[] = [];
  @Input() url = '';
  @Input() actions: DataTableAction[] = [];
  @Input() filters: any = {};
  @Input() remote = true;
  @Input() pageSizeOptions: number[] = [10, 25, 50];
  @Input() pageSize = 10;

  @Output() rowClick = new EventEmitter<any>();
  @Output() rowDblClick = new EventEmitter<any>();

  data$ = new BehaviorSubject<any[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  totalItems = 0;
  currentPage = 1;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (this.remote) this.fetchData();
    else this.data$.next([]); // puedes usar datos locales también
  }

  fetchData(): void {
    this.loading$.next(true);

    const params = new HttpParams()
      .set('limit', this.pageSize.toString())
      .set('page', this.currentPage.toString())
      .set('searchtxt', this.filters.searchtxt || '')
      .set('start', this.filters.start || '2020-01-01')
      .set('end', this.filters.end || '2050-01-01')
      //.set('showInactives', this.filters.showInactives ? 'true' : 'false');
      .set('showInactives', 'true');

    this.http.get<any>(this.url, { params }).pipe(
      
      tap(res => {
        this.data$.next(res.data.items || []);
        this.totalItems = res.data.totalItems || 0;
      }),
      catchError(() => {
        this.data$.next([]);
        this.totalItems = 0;
        return of();
      }),
      finalize(() => this.loading$.next(false))
    ).subscribe();
  }

  reload(): void {
  this.currentPage = 1; // opcional: reinicia la página
  this.fetchData();
}

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  onRowDblClick(row: any) {
    this.rowDblClick.emit(row);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchData();
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = +value;
    this.currentPage = 1;
    this.fetchData();
  }
  actionClicked(action: DataTableAction, row: any) {
    if (action.fn) action.fn(row);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


//   filters: any = {
//   searchtxt: '',
//   start: '2020-01-01',
//   end: '2050-01-01',
//   showInactives: false
// };

}

