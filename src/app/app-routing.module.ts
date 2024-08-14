import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ImageEditorComponent } from './view/image-editor/image-editor.component';
import { ImageEditorAdjustableComponent } from './view/image-editor-adjustable/image-editor-adjustable.component';
import { WithoutcropperComponent } from './view/withoutcropper/withoutcropper.component';

const routes: Routes = [
// {
//   path:"Editor",
//   component:ImageEditorComponent,
// },
{
  path:"selfieFrame",
  component:ImageEditorAdjustableComponent
},

{
  path:"selfie",
  component:WithoutcropperComponent
},
{
  path:"**",
  redirectTo:"/selfie",
  pathMatch:"full"
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
