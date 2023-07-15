import {INavbarData} from "./navbar-data.interface";

export const navBaData: INavbarData[] = [
  {
    routerLink: 'home',
    icon: 'fal fa-home',
    label: 'Home',
  },
  {
    routerLink: 'report',
    icon: 'fal fa-box-open',
    label: 'Report',
    items: [
      {
        routerLink: 'report/list',
        icon: 'fal fa-home',
        label: 'Report List',
        items:[
          {
            routerLink: 'report/list',
            icon: 'fal fa-home',
            label: 'Report List',
            items:[
              {
                routerLink: 'report/list',
                icon: 'fal fa-home',
                label: 'Report List',
                items:[
                  {
                    routerLink: 'report/list',
                    icon: 'fal fa-home',
                    label: 'Report List',
                  },
                  {
                    routerLink: 'report/list',
                    icon: 'fal fa-home',
                    label: 'Report List',
                  },
                  {
                    routerLink: 'report/list',
                    icon: 'fal fa-home',
                    label: 'Report List',
                  },
                  {
                    routerLink: 'report/list',
                    icon: 'fal fa-home',
                    label: 'Report List',
                  },
                ]
              },
              {
                routerLink: 'report/list',
                icon: 'fal fa-home',
                label: 'Report List',
              },
              {
                routerLink: 'report/list',
                icon: 'fal fa-home',
                label: 'Report List',
              },
              {
                routerLink: 'report/list',
                icon: 'fal fa-home',
                label: 'Report List',
              },
            ]
          },
          {
            routerLink: 'report/list',
            icon: 'fal fa-home',
            label: 'Report List',
          },
          {
            routerLink: 'report/list',
            icon: 'fal fa-home',
            label: 'Report List',
            items:[
              {
                routerLink: 'report/list',
                icon: 'fal fa-home',
                label: 'Report List',
              },
              {
                routerLink: 'report/list',
                icon: 'fal fa-home',
                label: 'Report List',
              },
              {
                routerLink: 'report/list',
                icon: 'fal fa-home',
                label: 'Report List',
              },
              {
                routerLink: 'report/list',
                icon: 'fal fa-home',
                label: 'Report List',
              },
            ]
          },
          {
            routerLink: 'report/list',
            icon: 'fal fa-home',
            label: 'Report List',
          },
        ]
      },
      {
        routerLink: 'report/list',
        icon: 'fal fa-home',
        label: 'Report List',
      },
      {
        routerLink: 'report/list',
        icon: 'fal fa-home',
        label: 'Report List',
      },
      {
        routerLink: 'report/list',
        icon: 'fal fa-home',
        label: 'Report List',
      },
      {
        routerLink: 'report/create',
        icon: 'fal fa-home',
        label: 'Create Report',
      }
    ]
  },
  {
    routerLink: 'task',
    icon: 'fal fa-chart-bar',
    label: 'Task'
  }
]
