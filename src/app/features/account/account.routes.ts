import { Routes } from '@angular/router';
import { AccountList } from './account-list/account-list';

export const ACCOUNT_ROUTES: Routes = [
    {
        path: '',
        component: AccountList
    }
];