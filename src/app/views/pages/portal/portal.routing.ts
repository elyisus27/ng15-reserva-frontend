
import { Routes } from '@angular/router';
import { CfeListComponent } from './cfe-list/cfe-list.component';


export const ROUTES: Routes = [{
    path: '',

    children: [
        {
            path: '',
            redirectTo: 'cfe-list',
            pathMatch: 'full',
        },
        {
            path: 'home',
            redirectTo: 'cfe-list',
            pathMatch: 'full',
        },
        {
            path: 'houseslist',
            redirectTo: 'cfe-list',
            pathMatch: 'full',
        },
        {
            path: 'smartdt',
            redirectTo: 'cfe-list',
            pathMatch: 'full',
        },
        {
            path: 'cfe-list',
            component: CfeListComponent
        },
        {
            path: 'cfe',
            loadChildren: () =>
                import('../cfe/cfe.module').then(m => m.CfeModule)
        }
    ]
}];
