import { Component, forwardRef, ViewChild, ElementRef, Input, Optional, Inject, OnInit, HostListener, ChangeDetectorRef, NgZone, EventEmitter, Output } from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS  } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ElementBase } from '../formmodel';
import { ListPickerComponent } from '../../pickers/list-picker/list-picker.component';
import { environment } from '../../../../../environments/environment'


export const SelectFieldValueAccessor: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectFieldComponent),
    multi: true
};

@Component({
    selector: 'ls-selectfield',
    templateUrl: './selectfield.component.html',
    styleUrls: ['../formfield.component.scss'],
    providers: [SelectFieldValueAccessor, HttpClient],
    changeDetection: 0
})
export class SelectFieldComponent extends ElementBase<string> implements OnInit {
    @ViewChild(NgModel, {static: false}) model: NgModel;
    @ViewChild('input', {static: false}) el: ElementRef;
    @ViewChild('componentEl', {static: false}) componentEl: ElementRef;

    @ViewChild('listContainer', {static: false}) listContainerEl: ElementRef;
    @ViewChild(ListPickerComponent, {static: false}) listComponent: ListPickerComponent;

    @Input() data: any[] = [];

    @Input() filterable = true;
    @Input() remote = true;
    @Input() pagination = true;
    @Input() pageNum = 1;
    @Input() pageSize = 25;
    @Input() multiselect = false;

    @Input() url = '/';

    @Input() placeholder = '';
    @Input() displayField = 'text';
    @Input() valueField = 'id';

    @Input() triggerClass = 'trigger-search';
    @Input() itemTpl: (data: any) => string;
    @Input() filters: {};

    @Input() listWidth = 200;

    @Output() select = new EventEmitter();

    private currentPage: number = 0;
    private dataCount: number = 0;
    private maskId: number;
    private itemFocused: number = 0;
    private tmpData: any[];
    private filter: string = '';

    selected: any[] = [];
    selectedText: string = '';
    private filterHandler: any;

    listElement: Node;
    listShowing: boolean = false;
    listContainerStyle = {};
    valueAsigned: boolean = false;

    constructor(
        protected cdr: ChangeDetectorRef,
        @Optional() @Inject(NG_VALIDATORS) protected validators: Array<any>,
        @Optional() @Inject(NG_ASYNC_VALIDATORS) protected asyncValidators: Array<any>,
        private http: HttpClient,
        protected ngZone: NgZone
    ) {
        super(cdr, validators, asyncValidators, ngZone);

        this.registerOnWrite((value) => {
            this.loadValue();
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.triggerClass = 'ls-button-trigger ' + this.cls;

        if (!this.remote) {
            this.filterable = false;
        }
    }

    inputKeyDown(event) {
        if (event.key === 'ArrowDown') {
            if (this.listShowing) {
                this.listComponent.setFocus();
            } else {
                this.expand('down');
            }
        } else if (event.key === 'Escape') {
            if (this.listShowing) {
                this.collapse();
            }
        }
    }

    focusOutList() {
        this.listShowing = false;
    }

    expand(action?: string) {
        this.listShowing = true;

        const fieldRect = this.componentEl.nativeElement.getBoundingClientRect();
        // const listWidth = fieldRect.width;
        // const listLeft = fieldRect.left;

        if ((fieldRect.top / window.innerHeight) < 0.8) {
            // const listTop = fieldRect.top + fieldRect.height - 1;

            this.listContainerStyle = {
                'top': '100%'
            };
        } else {
            // const listBottom = window.innerHeight - fieldRect.top + 15;

            this.listContainerStyle = {
                'bottom': '100%'
            };
        }

        this.detectChanges();

        setTimeout(() => {
			this.tmpData = [];
            if (this.remote) {
                this.loadData(action);
            } else {
                this.createList(action);
            }
        }, 0);
    }

    collapse() {
        if (this.listShowing) {
            this.listShowing = false;
            this.el.nativeElement.focus();

            this.detectChanges();
        }
    }

    loadData(action?: string) {
        // this.listComponent.loading(true);
        this.data = [];

        const FILTER = action === 'all' || (!this.listShowing && action === 'down') ? '' : (this.el.nativeElement.value || '');

        const filters: any = {};
        filters[this.displayField] = FILTER;


        const params: HttpParams = new HttpParams()
			.set('limit', this.pageSize.toString())
			.set('page', (this.pageNum).toString())
			.set('sort', JSON.stringify([{ column: this.displayField, direction: 'ASC' }]))
			.set('filter', JSON.stringify({ generals: filters, others: this.filters}));

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };

        const href = environment.api_url;
		const requestUrl =  `${href}${this.url}`;

        this.http.get<any>(requestUrl, options).subscribe((result: any) => {
            if (result.success) {
                this.listComponent.loading(false);
                this.data = result.data.items;
                this.dataCount = result.data.totalItems;

                this.createList(action);
            }
        });
    }

    loadValue() {
        if (!this.value) {
            this.clearSelection();
            return;
        }
        if (this.remote) {
            const options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            };

            const href = environment.api_url;
		    const requestUrl =  `${href}${this.url}`;

            this.http.get(`${requestUrl}/${this.value}`, options).subscribe((result: any) => {
                if (result.success) {
                    if (result.data) {
                        this.setSelection(result.data);
                    }
                }
            });
        } else {
            this.selected = this.data.filter((val, idx, arr) => val[this.valueField] === this.value);
            this.syncSelection();
        }
    }

    createList(action?: string) {
        this.tmpData = this.data;

        setTimeout(() => {
            if (action === 'down') {
                this.listComponent.setFocus();
            }

            this.detectChanges();
        }, 100);
    }

    filterData(e) {
        if ((e.which !== 0 && e.charCode !== 0) || e.which === 13 || e.which === 9 || e.code.indexOf('Arrow') >= 0) {
            e.preventDefault();
            return;
        }

        clearTimeout(this.filterHandler);

        this.filterHandler = setTimeout(() => {
            this.expand();
        }, 500);
    }

    setSelection(value) {
        if (this.multiselect) {
            const idx = this.selected.findIndex((s) => s[this.valueField] === value[this.valueField]);

            if (idx < 0) {
                this.selected.push(value);
            } else {
                this.selected.splice(idx, 1);
            }
        } else {
            this.selected = [ value ];

            this.collapse();
        }
        this.change.emit(value);
        this.syncSelection();
        // this.el.nativeElement.focus();
    }

    clearSelection() {
        this.selected = [];

        this.change.emit(null);
        this.syncSelection();
    }

    private syncSelection() {
        if (this.selected.length === 1) {
            this.selectedText = this.selected[0][this.displayField];
            this.value = this.selected[0][this.valueField];
        } else if (this.selected.length === 0) {
            this.selectedText = '';
            this.value = '';
        } else {
            this.selectedText = `${this.selected.length} elementos seleccionados`;
            this.value = this.selected.map((v) => v[this.valueField]).join(',');
        }

        this.select.emit(this.selected);
        this.detectChanges();

    }

    @HostListener('document:click', ['$event', '$event.target'])
    onClick(event: MouseEvent, targetElement: HTMLElement): void {
        if (event['path'].findIndex(i => i === this.componentEl.nativeElement) < 0) {
            this.listShowing = false;
        }
    }

    // @HostListener('button:click', ['$event', '$event.target'])
    // onBtnClick(event: MouseEvent, targetElement: HTMLElement): void {
    //     if (event['path'].findIndex(i => i === this.componentEl.nativeElement) < 0) {
    //         this.listShowing = false;
    //     }
    // }

    @HostListener('document:keydown', ['$event', '$event.target'])
    onDocumentKeyown(event: KeyboardEvent, targetElement: HTMLElement): void {
        if (event.key === 'Escape') {
            if (this.listShowing) {
                this.collapse();
            }
        }
    }

    checkFocus(value?: boolean) {
        setTimeout(() => {
            this.hasFocus = this.componentEl.nativeElement.querySelector(':focus') !== null;

            this.dynClsUpdate();
            this.syncSelection();

            if (this.hasFocus) {
                this.componentEl.nativeElement.querySelectorAll('input').forEach(function(el) { el.select(); });
            }
        }, 50);
    }
}
