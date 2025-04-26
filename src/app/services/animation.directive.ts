import {
    Directive,
    ElementRef,
    HostBinding,
    OnDestroy,
    OnInit
  } from '@angular/core';
  
  @Directive({
    selector: '[appScrollAnimation]',
    standalone: true             
  })
  export class ScrollAnimationDirective implements OnInit, OnDestroy {
    @HostBinding('class.in-view') isVisible = false;
    private observer!: IntersectionObserver;
  
    constructor(private el: ElementRef) {}
  
    ngOnInit(): void {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            this.observer.unobserve(this.el.nativeElement);
          }
        },
        { threshold: 0.1 }
      );
      this.observer.observe(this.el.nativeElement);
    }
  
    ngOnDestroy(): void {
      this.observer.disconnect();
    }
  }
  