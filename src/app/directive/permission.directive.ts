import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ForbiddenComponent } from '../component/forbidden/forbidden.component';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
  @Input('appPermission') requiredPermission: boolean = false;

  constructor(private viewContaiiner: ViewContainerRef, private templateRef: TemplateRef<unknown>) { }

  ngOnInit() {
    this.checkPermission();
  }

  private checkPermission(): void {
    if (this.requiredPermission) {
      this.viewContaiiner.createEmbeddedView(this.templateRef);
    } else {
      this.viewContaiiner.clear();
      this.viewContaiiner.createComponent(ForbiddenComponent);
    }
  }
}
