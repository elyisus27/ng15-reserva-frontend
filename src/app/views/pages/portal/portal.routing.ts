import { HousesListComponent } from 'src/app/avanza/components/houses-list/houses-list.component';
//import { AvdatatableComponent } from '../../../avanza/components/avdatatable/avdatatable.component';
import { TestComponent } from '../../../avanza/components/test/test.component';
import { CfeListComponent } from '../../../avanza/components/cfe-list/cfe-list.component';


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