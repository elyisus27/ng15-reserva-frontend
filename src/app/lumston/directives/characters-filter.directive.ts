import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
    selector: "[CharactersFilter]"
})
export class CharactersFilterDirective {
    @HostListener("keypress", ["$event"]) onKeyPress(event) {
        let e = <KeyboardEvent>event;
        
        const key = (document.all) ? e.keyCode : e.which;

        //key de retroceso para borrar, siempre la permite
        if (key == 8) {
            return true;
        }

        // Patron de entrada, en este caso solo acepta numeros y letras
        const patron = /[A-Za-z0-9 áéíóúÁÉÍÓÚüÜñÑ]/;
        const finalKey = String.fromCharCode(key);

        return patron.test(finalKey);
    }
}