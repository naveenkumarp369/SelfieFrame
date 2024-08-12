import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ImageEditorComponent } from './view/image-editor/image-editor.component';
import { ImageEditorAdjustableComponent } from './view/image-editor-adjustable/image-editor-adjustable.component';

const routes: Routes = [
{
  path:"Editor",
  component:ImageEditorComponent,
},
{
  path:"e2",
  component:ImageEditorAdjustableComponent
},
{
  path:"**",
  redirectTo:"/e2",
  pathMatch:"full"
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
