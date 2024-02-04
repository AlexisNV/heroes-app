import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: "[appUpperCase]",
    standalone: true,
})
export class UpperCaseDirective {
    constructor(private el: ElementRef) {
        /** Transforma solo de vista, no afecta a lo que se guarda. */
        this.el.nativeElement.style.textTransform = "uppercase";
    }
}
