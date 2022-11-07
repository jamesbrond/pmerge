import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ctrl-click]'
})
export class CtrlClickDirective implements OnInit, OnDestroy {
  private unsubscribe: any;
  @Output('ctrl-click') ctrlClickEvent = new EventEmitter();

  constructor(private readonly renderer: Renderer2, private readonly element: ElementRef) { }

  ngOnInit() {
    this.unsubscribe = this.renderer.listen(this.element.nativeElement, 'click', event => {
      if (event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        document.getSelection()?.removeAllRanges();

        this.ctrlClickEvent.emit(event);
      }
    });
  }

  ngOnDestroy() {
    if (!this.unsubscribe) {
      return;
    }
    this.unsubscribe();
  }
}
