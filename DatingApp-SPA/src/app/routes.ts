import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes';
import { MemberEditResolver } from './_resolvers/member-edit-resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { AuthGuard } from './_guards/auth.guard';
import { ListsComponent } from "./lists/lists.component";
import { MessagesComponent } from "./messages/messages.component";
import { MemberListComponent } from "./members/member-list/member-list.component";

import { HomeComponent } from "./home/home.component";
import { Routes } from "@angular/router";
import { MemberDetailResolver } from './_resolvers/member-detail-resolver';

export const appRoutes: Routes = [
  { path: "", component: HomeComponent },

  { path: "members", component: MemberListComponent, canActivate: [AuthGuard] },
  { path: "members/:id", component: MemberDetailComponent,  canActivate: [AuthGuard] },
  { path: "member/edit", component: MemberEditComponent, resolve: {user:MemberEditResolver}, canDeactivate:[PreventUnsavedChanges] , canActivate: [AuthGuard] },
  { path: "messages", component: MessagesComponent, canActivate: [AuthGuard] },
  { path: "lists", component: ListsComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
