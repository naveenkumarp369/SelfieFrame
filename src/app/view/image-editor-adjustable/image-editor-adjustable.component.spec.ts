import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditorAdjustableComponent } from './image-editor-adjustable.component';

describe('ImageEditorAdjustableComponent', () => {
  let component: ImageEditorAdjustableComponent;
  let fixture: ComponentFixture<ImageEditorAdjustableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageEditorAdjustableComponent]
    });
    fixture = TestBed.createComponent(ImageEditorAdjustableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
