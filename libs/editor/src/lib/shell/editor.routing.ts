import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import {
  CorrectionWebstoryComponent,
  CorrectionWebstoryComponentModule,
} from '../correction-webstory/correction-webstory.component'
import {
  CreateWebstoryComponent,
  CreateWebstoryComponentModule,
} from '../create-webstory/create-webstory.component'
import {
  DepublishWebstoryComponent,
  DepublishWebstoryComponentModule,
} from '../depublish-webstory/depublish-webstory.component'
import {
  EditWebstoryComponent,
  EditWebstoryComponentModule,
} from '../edit-webstory/edit-webstory.component'
import { WebStoryResolver } from '../editor.resolver'
import {
  KillWebstoryComponent,
  KillWebstoryComponentModule,
} from '../kill-webstory/kill-webstory.component'
import {
  NavigationEditorComponent,
  NavigationEditorComponentModule,
} from '../navigation-editor/navigation-editor.component'
import {
  WebstoryContainerComponent,
  WebstoryContainerComponentModule,
} from '../webstory-container/webstory-container.component'
import {
  WebstoryNotFoundComponent,
  WebstoryNotFoundComponentModule,
} from '../webstory-not-found/webstory-not-found.component'
import { WebStoryGetResolver } from '../webstory.get.resolver'
import { LayoutComponent } from './layout/layout.component'

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: NavigationEditorComponent },
      { path: 'navigations', component: NavigationEditorComponent },
      {
        path: 'create',
        component: CreateWebstoryComponent,
      },
      { path: 'notfound', component: WebstoryNotFoundComponent },
      {
        path: ':guid/edit',
        component: EditWebstoryComponent,
        resolve: {
          document: WebStoryResolver,
        },
      },
      {
        path: ':guid/correction',
        component: CorrectionWebstoryComponent,
        resolve: {
          document: WebStoryResolver,
        },
      },
      {
        path: ':guid/kill',
        component: KillWebstoryComponent,
        resolve: {
          document: WebStoryResolver,
        },
      },

      {
        path: ':guid/depublish',
        component: DepublishWebstoryComponent,
        resolve: {
          document: WebStoryResolver,
        },
      },

      {
        path: ':guid/fullview',
        component: WebstoryContainerComponent,
        resolve: {
          document: WebStoryGetResolver,
        },
      },
    ],
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CreateWebstoryComponentModule,
    EditWebstoryComponentModule,
    CorrectionWebstoryComponentModule,
    KillWebstoryComponentModule,
    NavigationEditorComponentModule,
    WebstoryNotFoundComponentModule,
    WebstoryContainerComponentModule,
    DepublishWebstoryComponentModule,
  ],
  exports: [RouterModule],
})
export class EditorRoutingModule {}
