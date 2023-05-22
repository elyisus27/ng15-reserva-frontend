import { Directive, OnInit, Input, ElementRef, TemplateRef, ViewContainerRef, Renderer2, HostBinding } from '@angular/core';

import { Observable } from 'rxjs';
import { Globals } from '../../services/globals';

//use of directive
// <div manAuthorized [permission]="'permission-string'" class="col-2 data-object-link">

@Directive({
	selector: '[hasPermission]'
})
export class PermissionDirective  {
	constructor(
		private _templateRef: TemplateRef<any>,
		private _viewContainer: ViewContainerRef,
		private _renderer: Renderer2, 
		private _el: ElementRef,
		private globals: Globals,

	) {}

	@Input() set hasPermission(condition: string) {
		if (this.globals.hasPermission(condition) || (condition || '').length === 0) {
			this._viewContainer.createEmbeddedView(this._templateRef);
		} else {
			this._viewContainer.clear();
		}
	}
}

@Directive({
	selector: '[disabledPermission]'
})
export class DisabledPermissionDirective implements OnInit  {
	constructor(
		private _renderer: Renderer2, 
		private _el: ElementRef,
		private globals: Globals,

	) {}

	@Input() 
	// @HostBinding('disabled')
	permission: string;

	ngOnInit() {
		if (!(this.globals.hasPermission(this.permission) || (this.permission || '').length === 0)) {
				this._renderer.setAttribute(this._el.nativeElement, 'readonly', "true");
		}
	}
}