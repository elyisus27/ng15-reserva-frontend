
//import { AvdatatableComponent } from '../../../avanza/components/avdatatable/avdatatable.component';
import { TestComponent } from '../../../avanza/components/test/test.component';
import { CfeListComponent } from './cfe-list/cfe-list.component';
import { HousesListComponent } from './houses-list/houses-list.component';



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