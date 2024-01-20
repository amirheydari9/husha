import {Component, Input, NgModule, TemplateRef, ViewChild} from '@angular/core';
import {CdkMenuModule} from "@angular/cdk/menu";
import {CommonModule} from "@angular/common";

export interface CascadeMenuItem {
  label: string;
  children?: CascadeMenuItem[];
}

@Component({
  selector: 'app-cascade-menu',
  template: `
    <ng-template #menu>
      <div cdkMenu>
        <ng-container *ngFor="let item of items">
          <ng-container *ngIf="hasChildren(item); else leafNode">
            <button *ngIf="menuComponent.menu as subMenu" cdkMenuItem [cdkMenuTriggerFor]="subMenu">
              <div>{{ item.label }}</div>
              <div *ngIf="item.children" class="pi pi-chevron-left" style="font-size:8px"></div>
            </button>
            <app-cascade-menu #menuComponent [items]="item.children"></app-cascade-menu>
          </ng-container>
          <ng-template #leafNode>
            <button cdkMenuItem>{{ item.label }}</button>
          </ng-template>
        </ng-container>
      </div>
    </ng-template>
  `,
  styleUrls: ['./cascade-menu.component.scss']
})
export class CascadeMenuComponent {

  @Input() items!: CascadeMenuItem[];
  @ViewChild('menu', {static: true}) menu!: TemplateRef<any>;

  hasChildren(item: CascadeMenuItem) {
    return item.children && item.children.length > 0;
  }

}


@NgModule({
  declarations: [CascadeMenuComponent],
  imports: [
    CdkMenuModule,
    CommonModule
  ],
  exports: [
    CascadeMenuComponent
  ]
})
export class CascadeMenuModule {

}
