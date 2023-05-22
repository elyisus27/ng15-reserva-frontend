import { Component, Input, Output, ElementRef, EventEmitter, OnInit, ViewChild, DoCheck, Optional, NgZone, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NgModel, Validators } from '@angular/forms';

// import { Observable } from 'rxjs/Observable';
import {
    AsyncValidatorArray,
    ValidatorArray,
    ValidationResult,
    message,
    validate,
} from './validate';

import { Observable } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Component({
    selector: 'ls-invalidmessages',
    template: `
      <div #container class="container">
        <ul>
            <li *ngFor="let message of messages">{{message}}</li>
        </ul>
      </div>
    `,
})
export class InvalidMessagesComponent {
    @ViewChild('container', {static: false}) container: ElementRef;
    @Input() messages: Array<string>;
}


export class ValueAccessorBase<T> implements ControlValueAccessor {
    private innerValue: T;


    private changed = new Array<(value: T) => void>();
    private touched = new Array<() => void>();
    private writed = new Array<(value: T) => void>();

    public get value(): T {
        return this.innerValue;
    }


    public set value(value: T) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.changed.forEach(f => f(value));
        }
    }


    touch() {
        this.touched.forEach(f => f());
    }


    writeValue(value: T) {
        this.innerValue = value;
        this.writed.forEach(f => f(value));
    }

    registerOnWrite(fn: (value: T) => void) {
        this.writed.push(fn);
    }

    registerOnChange(fn: (value: T) => void) {
        this.changed.push(fn);
    }


    registerOnTouched(fn: () => void) {
        this.touched.push(fn);
    }
}

export abstract class ElementBase<T> extends ValueAccessorBase<T> implements OnInit {

    abstract model: NgModel;

    @ViewChild('input', {static: false}) el: ElementRef;
    @ViewChild('componentEl', {static: false}) componentEl: ElementRef;

    @ViewChild(InvalidMessagesComponent, {static: false}) invalidMessages: InvalidMessagesComponent;

    /**
     * @Inputs()
     */
    @Input() label: string = 'Label';
    @Input() labelSeparator: string = '';
    @Input() labelWidth: number = 150;

    @Input() validateOnBlur: boolean = true;
    @Input() required: boolean = false;
    @Input() disabled: boolean = false;
    @Input() readonly: boolean = false;

    @Input() width: number = 500;
    @Input() anchor: boolean = false;
    @Input() cls: string = '';

    hasFocus: boolean = false;
    hasValue: boolean = false;
    isValid: boolean = true;

    dynCls: any = {
        'ls-formfield': true,
        'ls-formfield-inline': false,
        'ls-formfield-anchor': false,
        'ls-formfield-focused': false,
        'ls-formfield-floating': false,
        'ls-formfield-empty': this.hasValue,
        'ls-formfield-invalid': !this.isValid,
        'ls-formfield-disabled': this.disabled
    };

    @Output() change = new EventEmitter();
    @Output() focus = new EventEmitter();
    @Output() focusout = new EventEmitter();
    @Output() keyup = new EventEmitter();
    @Output() keydown = new EventEmitter();
    @Output() keypress = new EventEmitter();

    // we will ultimately get these arguments from @Inject on the derived class
    constructor(
        protected cdr: ChangeDetectorRef,
        protected validators: ValidatorArray,
        protected asyncValidators: AsyncValidatorArray,
        protected ngZone?: NgZone,
    ) {
        super();

        const checkValue = (value: T) => {
            switch (typeof(value)) {
                case 'string':
                    this.hasValue = (this.value || '') !== '';
                    break;

                case 'number':
                    this.hasValue = !isNaN(parseFloat(this.value.toString()));
                    break;

                default: {
                    this.hasValue = value !== null && value !== undefined;
                }
            }

            this.dynClsUpdate();
        };

        this.registerOnChange(checkValue);
        this.registerOnWrite(checkValue);
    }

    ngOnInit(): void {
    }

    public validate(): Observable<ValidationResult> {
        return validate(this.validators, this.asyncValidators)
        (this.model.control);
    }

    get invalid(): Observable<boolean> {
        return this.validate().pipe(
            map((v) => {
                return Object.keys(v || {}).length > 0;
            })
        )
    }


    get failures(): Observable<Array<string>> {
        return this.validate().pipe(
            map(v => {
                v = v || {};
                return Object.keys(v).map(k => message(v, k));
            })
        );
    }

    setFocus() {
        this.el.nativeElement.focus();
    }

    isFloating() {
        const r = (this.el.nativeElement === document.activeElement || this.hasValue === true);

        return r;
    }

    showErrors() {
        this.invalidMessages.container.nativeElement.style.display = 'block';
    }

    hideErrors() {
        this.invalidMessages.container.nativeElement.style.display = 'none';
    }

    dynClsUpdate() {
        this.dynCls = {
            'ls-formfield': true,
            'ls-formfield-inline': false,
            'ls-formfield-anchor': false,
            'ls-formfield-focused': this.hasFocus,
            'ls-formfield-empty': false,
            'ls-formfield-floating': true,
            'ls-formfield-invalid': !this.isValid,
            'ls-formfield-disabled': this.disabled,
        };
        this.dynCls[this.cls] = true;

        this.detectChanges();
        // this.cdr.markForCheck();
    }

    onFocus($event) {
        this.focus.emit($event);
    }

    onFocusOut($event) {
        this.focusout.emit($event);
    }

    onKeyPress($event) {
        this.keypress.emit($event);
    }

    onKeyDown($event) {
        this.keydown.emit($event);
    }

    onKeyUp($event) {
        this.keyup.emit($event);
    }

    detectChanges() {
        if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
        }
    }


    checkFocus(value?: boolean) {
        setTimeout(() => {
            this.hasFocus = this.componentEl.nativeElement.querySelector(':focus') !== null;
            this.dynClsUpdate();

            if (this.hasFocus) {
                this.focus.emit();
                this.componentEl.nativeElement.querySelector('input').select();
            } else {
                this.focusout.emit();
            }
        }, 10);

    }
}
