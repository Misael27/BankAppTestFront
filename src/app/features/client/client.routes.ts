import { Routes } from '@angular/router';
import { ClientList } from './client-list/client-list';

export const CLIENT_ROUTES: Routes = [
    {
        path: '',
        component: ClientList
    }
];