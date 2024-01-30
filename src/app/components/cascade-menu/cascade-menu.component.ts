import {Component, EventEmitter, Input, NgModule, Output, TemplateRef, ViewChild} from '@angular/core';
import {CdkMenuModule} from "@angular/cdk/menu";
import {CommonModule} from "@angular/common";

export interface CascadeMenuItem {
  id: number;
  label: string;
  children?: CascadeMenuItem[];
}

@Component({
  selector: 'app-cascade-menu',
  template: `
    <ng-template #menu>
      <div class="overlay overlay-container overlay-fall" cdkMenu>
        <ul>
          <li *ngFor="let item of items">
            <ng-container *ngIf="hasChildren(item); else leafNode">
              <div *ngIf="menuComponent.menu as subMenu" cdkMenuItem class="menu-item" [cdkMenuTriggerFor]="subMenu">
                <span>{{item.label}}</span>
                <span *ngIf="item.children" class="pi pi-chevron-left" style="font-size:8px"></span>
              </div>
              <app-cascade-menu #menuComponent [items]="item.children"
                                (onSelectMenu)="onSelectMenu.emit($event)"></app-cascade-menu>
            </ng-container>
            <ng-template #leafNode>
              <div cdkMenuItem class="menu-item">
                <span class="w-full" (click)="onSelectMenu.emit(item)">{{item.label}}</span>
              </div>
            </ng-template>
          </li>
        </ul>
      </div>
    </ng-template>
  `,
  styleUrls: ['./cascade-menu.component.scss']
})
export class CascadeMenuComponent {

  @Input() items!: CascadeMenuItem[];
  @ViewChild('menu', {static: true}) menu!: TemplateRef<any>;

  @Output() onSelectMenu: EventEmitter<CascadeMenuItem> = new EventEmitter<CascadeMenuItem>()

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
