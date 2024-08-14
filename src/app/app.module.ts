import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageEditorComponent } from './view/image-editor/image-editor.component';
import { ImageEditorAdjustableComponent } from './view/image-editor-adjustable/image-editor-adjustable.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPhotoEditorModule} from "ngx-photo-editor";
import { WithoutcropperComponent } from './view/withoutcropper/withoutcropper.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageEditorComponent,
    ImageEditorAdjustableComponent,
    WithoutcropperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxPhotoEditorModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
