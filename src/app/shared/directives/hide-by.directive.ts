import { Directive, ElementRef, Renderer, Input, OnInit, DoCheck } from '@angular/core';

@Directive({ selector: '[hideBy]' })
export class HideByDirective implements OnInit, DoCheck {

  private elRef: HTMLElement;
  private element: HTMLElement;
  @Input('hideBy') idRef: string;
  @Input() lessThan: number;
  @Input() biggerThan: number;

  constructor(private el: ElementRef, private renderer: Renderer) {
    // guarda referencia do elemento
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    if (this.idRef) {
      // encontra o elemento para comparar
      this.elRef = document.getElementById(this.idRef);
    }
  }

  ngDoCheck() {
    // compara os tamanhos
    if ((this.lessThan && this.lessThan > this.elRef.offsetWidth) ||
        (this.biggerThan && this.biggerThan < this.elRef.offsetWidth)) {

      // esconde
      this.renderer.setElementStyle(
        this.element,
        'display',
        'none'
      );
    } else {
      // exibe
      this.renderer.setElementStyle(
        this.element,
        'display',
        ''
      );
    }
  }

}
