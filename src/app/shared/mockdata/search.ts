import { texts } from './texts';
import { MenuMock } from './menu';

let itens = [];
for (let item in MenuMock.root) {

  if ( typeof(MenuMock.root[item]['sub']) == 'undefined' ) {

    itens.push({
      name: MenuMock.root[item]['name'],
      title: MenuMock.root[item]['title'],
      link: MenuMock.root[item]['link']
    });

  } else {

    for (let sub in MenuMock.root[item]['sub']) {
      itens.push({
        name: MenuMock.root[item]['sub'][sub]['name'],
        title: MenuMock.root[item]['sub'][sub]['title'],
        link: MenuMock.root[item]['sub'][sub]['link']
      });
    }

  }
}

export class SearchMock {
  static items = itens;
  // static items = [
  //   {
  //     name: 'dashboard',
  //     title: 'Dashboard',
  //     faIcon: 'fa-tachometer',
  //     link: '/dashboard'
  //   },
  //   {
  //     name: 'cadstros_de_simuladores',
  //     title: texts.menu.moduleR.simulators,
  //     link: '/moduleR/simulators'
  //   },
  //   {
  //     name: 'eventos_possiveis_em_simulacao',
  //     title: texts.menu.moduleCf.simulationEvent,
  //     link: '/moduleCf/simulation-event'
  //   },
  //   {
  //     name: 'card',
  //     title: 'Card',
  //     link: '/component-card'
  //   },
  //   {
  //     name: 'dialog',
  //     title: 'Dialog',
  //     link: '/component-dialog'
  //   },
  //   {
  //     name: 'notifications',
  //     title: 'Notifications',
  //     link: '/component-notifications'
  //   },
  //   {
  //     name: 'checkbox',
  //     title: 'Checkbox',
  //     link: '/component-checkbox'
  //   },
  //   {
  //     name: 'chips',
  //     title: 'Chips',
  //     link: '/component-chips'
  //   },
  //   {
  //     name: 'date-picker',
  //     title: 'Date Picker',
  //     link: '/component-date-picker'
  //   },
  //   {
  //     name: 'list',
  //     title: 'List',
  //     link: '/component-list'
  //   },
  //   {
  //     name: 'media-player',
  //     title: 'Media Player',
  //     link: '/component-media-player'
  //   },
  //   {
  //     name: 'menu',
  //     title: 'Menu',
  //     link: '/component-menu'
  //   },
  //   {
  //     name: 'select',
  //     title: 'Select',
  //     link: '/component-select'
  //   },
  //   {
  //     name: 'slide-toggle',
  //     title: 'Slide Toggle',
  //     link: '/component-slide-toggle'
  //   },
  //   {
  //     name: 'slider',
  //     title: 'Slider',
  //     link: '/component-slider'
  //   },
  //   {
  //     name: 'tabs',
  //     title: 'Tabs',
  //     link: '/component-tabs'
  //   },
  //   {
  //     name: 'text-editor',
  //     title: 'Text Editor',
  //     link: '/component-text-editor'
  //   },
  //   {
  //     name: 'toolbar',
  //     title: 'Toolbar',
  //     link: '/component-toolbar'
  //   },
  //   {
  //     name: 'bootstrap',
  //     title: 'Bootstrap',
  //     link: '/component-bootstrap'
  //   },
  //   {
  //     name: 'tooltip',
  //     title: 'Tooltip',
  //     link: '/component-tooltip'
  //   }
  // ];
}
