

import { TestComponent } from '../../../avanza/components/test/test.component';
import { CfeListComponent } from '../admin-dashboard/components/cfe-list/cfe-list.component';
import { HousesListComponent } from '../admin-dashboard/components/houses-list/houses-list.component';



export const ROUTES = [{
    path: '',

    children: [
        {
            path: 'home',
            component: HousesListComponent,
        },
        {
            path: 'houseslist',
            component: HousesListComponent,
        },
        {
            path: 'smartdt',
            component: TestComponent,
        },
        {
            path: 'cfe-list',
            component: CfeListComponent,
        },

    ]
}];