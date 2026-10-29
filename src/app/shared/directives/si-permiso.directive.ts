import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Directive({ selector: '[siPermiso]', standalone: true })
export class SiPermisoDirective {
  readonly siPermiso = input.required<string>();
  private readonly auth = inject(AuthService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);
  private visible = false;

  constructor() {
    effect(() => {
      const next = this.auth.tienePermiso(this.siPermiso());
      if (next && !this.visible) this.container.createEmbeddedView(this.template);
      if (!next && this.visible) this.container.clear();
      this.visible = next;
    });
  }
}
