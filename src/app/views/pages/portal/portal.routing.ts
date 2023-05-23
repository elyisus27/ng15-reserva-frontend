import { AvdatatableComponent } from '../../../avanza/components/avdatatable/avdatatable.component';
import { TestComponent } from '../../../avanza/components/test/test.component';

export const ROUTES = [{
    path: '',

    children: [
        {
            path: 'home',
            component: TestComponent,
        },
        {
            path: 'mattabletest',
            component: AvdatatableComponent,
        },

    ]
}];