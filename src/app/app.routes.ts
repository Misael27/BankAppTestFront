import { Routes } from '@angular/router';
import { MainLayout } from './shared/main-layout/main-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'clients',
                loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
            },
            { path: 'accounts', loadChildren: () => import('./features/account/account.routes').then(m => m.ACCOUNT_ROUTES) },
            { path: 'movements', loadChildren: () => import('./features/movement/movement.routes').then(m => m.MOVEMENT_ROUTES) },
            { path: 'reports', loadChildren: () => import('./features/report/report.routes').then(m => m.REPORT_ROUTES) },
        ]
    }
];
