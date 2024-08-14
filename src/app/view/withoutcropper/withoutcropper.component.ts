import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-withoutcropper',
  templateUrl: './withoutcropper.component.html',
  styleUrls: ['./withoutcropper.component.scss']
})
export class WithoutcropperComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private templateImage = new Image();
  private uploadedImage = new Image();
  
  // State variables for dragging and resizing
  private isDragging = false;
  private isResizing = false;
  private startX = 0;
  private startY = 0;
  private lastTouchDistance = 0;
  private scale = 1;
  private dx = 0;
  private dy = 0;
  // private canvasRect = this.canvas.nativeElement.getBoundingClientRect();
  isImageUploaded = false;
  displayCanvas="none";
  ngOnInit() {
    this.templateImage.src = 'assets/selfieFrame.png';
    this.templateImage.onload = () => {
      // Set canvas size to match the template image size
      this.canvas.nativeElement.width = this.templateImage.width;
      this.canvas.nativeElement.height = this.templateImage.height;
      this.ctx = this.canvas.nativeElement.getContext('2d')!;
      this.drawTemplate();
    };
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 0) { // Left mouse button
      this.isDragging = true;
      this.startX = event.clientX - this.dx;
      this.startY = event.clientY - this.dy;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const x = event.clientX - this.startX;
      const y = event.clientY - this.startY;
      this.dx = x;
      this.dy = y;
      this.drawImages();
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button === 0) { // Left mouse button
      this.isDragging = false;
    }
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault(); // Prevent page zooming
    const scaleFactor = 1.1;
    if (event.deltaY < 0) {
      this.scale *= scaleFactor; // Zoom in
    } else {
      this.scale /= scaleFactor; // Zoom out
    }
    this.drawImages();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      // Single finger touch (dragging)
      this.isDragging = true;
      this.startX = event.touches[0].clientX - this.dx;
      this.startY = event.touches[0].clientY - this.dy;
    } else if (event.touches.length === 2) {
      // Two finger touch (resizing)
      this.isResizing = true;
      this.lastTouchDistance = this.getDistance(event.touches[0], event.touches[1]);
    }
    event.preventDefault(); // Prevent default scrolling behavior on mobile
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isDragging && event.touches.length === 1) {
      const x = event.touches[0].clientX - this.startX;
      const y = event.touches[0].clientY - this.startY;
      this.dx = x;
      this.dy = y;
      this.drawImages();
    } else if (this.isResizing && event.touches.length === 2) {
      const newDistance = this.getDistance(event.touches[0], event.touches[1]);
      const scaleChange = newDistance / this.lastTouchDistance;
      this.scale *= scaleChange;
      this.lastTouchDistance = newDistance;
      this.drawImages();
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (event.touches.length === 0) {
      this.isDragging = false;
      this.isResizing = false;
    }
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.displayCanvas="block";

        this.uploadedImage.src = e.target.result;
        this.uploadedImage.onload = () => {
          this.drawImages();
        };
        this.isImageUploaded=true;

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
   
    // Draw uploaded image with transformations
    this.ctx.save();
    this.ctx.translate(this.canvas.nativeElement.width / 2 + this.dx, this.canvas.nativeElement.height / 2 + this.dy);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.drawImage(this.uploadedImage, -this.uploadedImage.width / 2, -this.uploadedImage.height / 2);
    this.ctx.restore();



     // Draw template
     this.drawTemplate();
  }

  downloadImage() {
    const link = document.createElement('a');
    link.download = 'final-image.png';
    link.href = this.canvas.nativeElement.toDataURL();
    link.click();
  }
}
