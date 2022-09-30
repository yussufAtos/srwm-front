import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  {
    path: 'editor',
    loadChildren: () =>
      import('@webstory/editor').then((m) => m.EditorRoutingModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('@webstory/editor').then((m) => m.EditorRoutingModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@webstory/editor').then((m) => m.EditorRoutingModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
