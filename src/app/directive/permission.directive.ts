import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ForbiddenComponent } from '../component/forbidden/forbidden.component';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
  @Input('appPermission') requiredPermission: Observable<boolean> = new Observable<boolean>();

  constructor(private viewContaiiner: ViewContainerRef, private templateRef: TemplateRef<unknown>) { }

  ngOnInit() {
    this.checkPermission();
  }

  private checkPermission(): void {
    this.requiredPermission.subscribe((permission: boolean) => {
      this.viewContaiiner.clear();
      if (permission) {
        this.viewContaiiner.createEmbeddedView(this.templateRef);
      } else {
        this.viewContaiiner.createComponent(ForbiddenComponent);
      }
    });
  }
}
