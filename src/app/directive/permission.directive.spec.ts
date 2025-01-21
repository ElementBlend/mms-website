import { TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionDirective } from './permission.directive';

describe('PermissionDirective', () => {
  it('should create an instance', () => {
    const viewContainerRef = {} as ViewContainerRef;
    const templateRef = {} as TemplateRef<unknown>;
    const directive = new PermissionDirective(viewContainerRef, templateRef);
    expect(directive).toBeTruthy();
  });
});
