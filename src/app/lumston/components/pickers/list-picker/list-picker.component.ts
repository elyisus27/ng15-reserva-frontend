import { Component, Input, ViewChild, ElementRef, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
// import { ButtonComponent } from '../../buttons/button.component';
// import { MaskService } from '../../../services';

@Component({
  selector: 'ls-list-picker',
  templateUrl: './list-picker.component.html',
  styleUrls: ['./list-picker.component.scss']
})
export class ListPickerComponent {
    @ViewChild('container', {static: false}) containerEl: ElementRef;
    @ViewChildren('button') listItems: QueryList<ElementRef>;

    @Input() data: any[];
    @Input() width: number;
    @Input() anchor = true;
    @Input() cls = '';

    @Input() displayField = 'text';
    @Input() valueField = 'id';

    @Input() tpl: (data: any) => string;

    @Output() onselect = new EventEmitter();
    @Output() onfocus = new EventEmitter();
    @Output() onfocusout = new EventEmitter();
    @Output() onkeydown = new EventEmitter();


    pageStart = 0;
    dataCount = 0;

    maskId: number;
    itemFocused = 0;

    tmpData: any[];
    filter = '';

    isReady = false;

    constructor() {
    }

    loading(show: boolean) {

    }

    setFocus() {
        if ((this.data || []).length > 0) {
            this.listItems.first.nativeElement.focus();
        }
    }

    setSelection(value) {
        const idx = this.data.findIndex((item) => item[this.valueField].toString() === (value || '').toString());

        if (idx >= 0) {
            this.itemFocused = idx;
            this.listItems.find((item: any, index: number) => index === this.itemFocused).nativeElement.focus();
        } else {
            this.listItems.first.nativeElement.focus();
        }
    }

    onSelect(item) {
        this.onselect.emit(item);
    }

    onFocus(idx) {
        this.itemFocused = idx;
        this.onfocus.emit();
    }

    onFocusOut() {
        this.onfocusout.emit();
    }

    onKeyDown(e) {
        e.stopPropagation();

        if (e.key === 'ArrowDown') {
            this.nextItem();
        } else if (e.key === 'ArrowUp') {
            this.prevItem();
        } else if (e.key === 'Enter') {
            return;
        } else {
            this.onkeydown.emit(e);
        }

        e.preventDefault();
    }

    nextItem() {
        this.itemFocused++;

        if (this.itemFocused >= this.listItems.length) {
            this.itemFocused = 0;
        }

        this.listItems.find((item: any, index: number) => index === this.itemFocused).nativeElement.focus();
    }

    prevItem() {
        this.itemFocused--;

        if (this.itemFocused < 0) {
            this.itemFocused = this.listItems.length - 1;
        }


        this.listItems.find((item: any, index: number) => index === this.itemFocused).nativeElement.focus();
    }

    private getItemTpl(item: any) {
        if (this.tpl === undefined) {
            return `${item[this.displayField]}`;
        } else {
            return this.tpl(item);
        }
    }
}
