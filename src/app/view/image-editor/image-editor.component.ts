import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private templateImage = new Image();
  private uploadedImage = new Image();

 ngOnInit() {
  this.templateImage.src = 'assets/your-template.png';
  this.templateImage.onload = () => {
    // Set canvas size to match the template image size
    this.canvas.nativeElement.width = this.templateImage.width;
    this.canvas.nativeElement.height = this.templateImage.height;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawTemplate();
  };
}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage.src = e.target.result;
        this.uploadedImage.onload = () => {
          this.drawImages();
        };
      };
      reader.readAsDataURL(file);
    }
  }

  drawTemplate() {
    // Draw template image on canvas
    this.ctx.drawImage(this.templateImage, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  drawImages() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // Draw template
    this.drawTemplate();
    // Draw uploaded image
    this.ctx.drawImage(this.uploadedImage, 50, 50, 500, 500); // Adjust position and size as needed
  }

  downloadImage() {
    const link = document.createElement('a');
    link.download = 'final-image.png';
    link.href = this.canvas.nativeElement.toDataURL();
    link.click();
  }
}
