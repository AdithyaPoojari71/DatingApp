import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberList } from '../features/members/member-list/member-list';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuardGuard } from '../core/guards/auth-guard-guard';

export const routes: Routes = [
    { path:'', component:Home },
    {
        path:'',
        runGuardsAndResolvers:'always',
        canActivate:[authGuardGuard],
        children:[
            { path:'members', component:MemberList},
            { path:'members/:id', component:MemberDetailed },
            { path:'lists', component:Lists },
            { path:'messages', component:Messages },
        ]
    },
    { path:'**', component:Home },
];
