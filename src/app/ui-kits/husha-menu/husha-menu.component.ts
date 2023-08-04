import {AfterViewInit, Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {TieredMenu, TieredMenuModule} from "primeng/tieredmenu";
import {ButtonModule} from "primeng/button";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-husha-menu',
  template: `
      <ng-content></ng-content>
      <p-tieredMenu #hushaMenu [model]="items" [popup]="true" [autoZIndex]="true"></p-tieredMenu>
  `,
  styles: [`
    //:host ::ng-deep {
    //  .app-husha-menu .p-tieredmenu .p-menuitem-link .p-submenu-icon {
    //    margin-left: unset;
    //    margin-right: auto;
    //    transform: rotate(180deg);
    //  }
    //
    //  .app-husha-menu .p-tieredmenu .p-menuitem-active > p-tieredmenusub > .p-submenu-list.p-submenu-list-flipped {
    //    left: -150%;
    //  }
    //
    //  .app-husha-menu .p-tieredmenu.p-tieredmenu-overlay {
    //    right: 25px;
    //    left: unset;
    //  }
    //}
  `
  ]
})
export class HushaMenuComponent {

  @ViewChild('hushaMenu') menu: TieredMenu

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
  declarations: [HushaMenuComponent],
  imports: [
    TieredMenuModule,
    ButtonModule
  ],
  exports: [HushaMenuComponent]
})
export class HushaMenuModule {

}
