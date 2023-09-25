import {Component, EventEmitter, Input, NgModule, Output, ViewChild} from '@angular/core';
import {TieredMenu, TieredMenuModule} from "primeng/tieredmenu";
import {MenuItem} from "primeng/api";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-custom-menu',
  template: `
    <ng-content></ng-content>
    <p-tieredMenu #menu [model]="items" [popup]="true" [autoZIndex]="true"></p-tieredMenu>
  `,
  styles: [`
    :host ::ng-deep {
      .p-tieredmenu .p-menuitem-link .p-submenu-icon {
        margin-left: unset;
        margin-right: auto;
        transform: rotate(180deg);
      }

      .p-tieredmenu .p-menuitem-active > p-tieredmenusub > .p-submenu-list {
        left: unset;
        right: 100%;
      }
    }
  `
  ]
})
export class CustomMenuComponent {

  @ViewChild('menu') menu: TieredMenu

  private _items: MenuItem[]
  @Input() set items(items: MenuItem[]) {
    this.injectCommand(items)
    this._items = items
  }

  get items(): MenuItem[] {
    return this._items
  }

  @Output() selectedMenu: EventEmitter<MenuItem> = new EventEmitter<MenuItem>()

  constructor() {
  }

  private injectCommand(menu: MenuItem[]) {
    var i = 0;
    var j = 0;
    for (i = 0; i < menu.length; i++) {
      menu[i] = {...menu[i], command: (event) => this.emitValue(event.item)}
      if (menu[i].items !== null && menu[i].items?.length > 0) {
        for (j = 0; j < menu[i].items.length; j++) {
          this.injectCommand(menu[i].items)
        }
      }
    }
  }

  private emitValue(item: MenuItem) {
    if (!item.items) this.selectedMenu.emit(item)
  }

}

@NgModule({
  declarations: [CustomMenuComponent],
  imports: [
    TieredMenuModule,
    ButtonModule
  ],
  exports: [CustomMenuComponent]
})
export class CustomMenuModule {

}
