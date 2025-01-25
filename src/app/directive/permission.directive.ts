import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ForbiddenComponent } from '../component/forbidden/forbidden.component';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit, OnDestroy {
  @Input('appPermission') requiredPermission$: Observable<boolean> = new Observable<boolean>();
  private destroySubscription: Subject<boolean> = new Subject<boolean>();

  constructor(private viewContaiiner: ViewContainerRef, private templateRef: TemplateRef<unknown>) { }

  ngOnInit() {
    this.checkPermission();
  }

  private checkPermission(): void {
    this.requiredPermission$.pipe(
      takeUntil(this.destroySubscription)
    ).subscribe({
      next: (permission: boolean) => {
        this.viewContaiiner.clear();
        if (permission) {
          this.viewContaiiner.createEmbeddedView(this.templateRef);
        } else {
          this.viewContaiiner.createComponent(ForbiddenComponent);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }
}
