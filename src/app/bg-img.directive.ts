import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appBgImg]'
})
export class BgImgDirective implements OnInit  {

  constructor(private Element: ElementRef) { }

  @Input() src: string;

  ngOnInit() {
      this.Element.nativeElement.style.background = "url('"+this.src+ "')";
  }

}
