import {
    Directive,
    ElementRef,
    HostListener,
    Input
} from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    standalone: true
})
export class HighlightDirective {

    @Input() highlightColor = 'lightblue';

    constructor(private elementRef: ElementRef) { }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.elementRef.nativeElement.style.backgroundColor = this.highlightColor;
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.elementRef.nativeElement.style.backgroundColor = '';
    }
}

// | Structural Directive          | Attribute Directive         |
// | ----------------------------- | --------------------------- |
// | Changes DOM structure         | Changes behavior/appearance |
// | Uses `TemplateRef`            | Uses `ElementRef`           |
// | Often uses `ViewContainerRef` | Often uses `HostListener`   |
// | Example: `*ngIf`              | Example: `[ngClass]`        |
// | Our Q31: `*appIfRole`         | Our Q32: `appHighlight`     |


// A custom attribute directive is used to add custom behavior or styling to an existing DOM element. 
// We create it using @Directive, use ElementRef to access the host element, 
// HostListener to listen for events, and @Input() when we want configurable values.
