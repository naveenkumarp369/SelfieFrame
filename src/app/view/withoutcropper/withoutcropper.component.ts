import { Component, ElementRef, ViewChild } from '@angular/core';

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

  private imageX = 540;
  private imageY = 180;
  private dragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private imageScale = 1.3;
  private initialDistance = 0;

  private readonly minScale = 1.2;

  isImageUploaded = false;
  displayCanvas = "none";

  ngOnInit() {
    this.loadCanvas();
  }

  loadCanvas() {
    this.templateImage.src = 'assets/selfieFrame.png';
    this.templateImage.onload = () => {
      this.canvas.nativeElement.width = this.templateImage.width;
      this.canvas.nativeElement.height = this.templateImage.height;
      this.ctx = this.canvas.nativeElement.getContext('2d')!;
      this.drawTemplate();
    };

    this.canvas.nativeElement.addEventListener('mousedown', this.startDrag.bind(this));
    this.canvas.nativeElement.addEventListener('mousemove', this.onDrag.bind(this));
    this.canvas.nativeElement.addEventListener('mouseup', this.endDrag.bind(this));
    this.canvas.nativeElement.addEventListener('wheel', this.onMouseWheel.bind(this), { passive: false });

    this.canvas.nativeElement.addEventListener('touchstart', this.startTouch.bind(this), { passive: false });
    this.canvas.nativeElement.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    this.canvas.nativeElement.addEventListener('touchend', this.endTouch.bind(this), { passive: false });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      this.displayCanvas = "block";
      this.isImageUploaded = true;
      reader.onload = (e: any) => {
        this.uploadedImage.src = e.target.result;
        this.uploadedImage.onload = () => {
          this.drawImages();
        };
      };
      reader.readAsDataURL(file);
    }
  }

  drawImages() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const scaledWidth = 365 * this.imageScale;
    const scaledHeight = 350 * this.imageScale;
    this.ctx.drawImage(this.uploadedImage, this.imageX, this.imageY, scaledWidth, scaledHeight);
    this.drawTemplate();
  }

  drawTemplate() {
    this.ctx.drawImage(this.templateImage, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  startDrag(event: MouseEvent) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const scaledWidth = 365 * this.imageScale;
    const scaledHeight = 350 * this.imageScale;

    if (mouseX >= this.imageX && mouseX <= this.imageX + scaledWidth &&
      mouseY >= this.imageY && mouseY <= this.imageY + scaledHeight) {
      this.dragging = true;
      this.offsetX = mouseX - this.imageX;
      this.offsetY = mouseY - this.imageY;
    }
  }

  onDrag(event: MouseEvent) {
    if (this.dragging) {
      this.imageX = event.offsetX - this.offsetX;
      this.imageY = event.offsetY - this.offsetY;
      this.drawImages();
    }
  }

  endDrag() {
    this.dragging = false;
  }

  onMouseWheel(event: WheelEvent) {
    event.preventDefault();  // Prevent page scrolling on scale
    const scaleChange = event.deltaY > 0 ? -0.1 : 0.1;
    this.imageScale = Math.max(this.minScale, this.imageScale + scaleChange);  // Ensure scale doesn't go below minScale
    this.drawImages();
  }

  startTouch(event: TouchEvent) {
    event.preventDefault();  // Prevent default behavior

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const mouseX = touch.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
      const mouseY = touch.clientY - this.canvas.nativeElement.getBoundingClientRect().top;
      const scaledWidth = 365 * this.imageScale;
      const scaledHeight = 350 * this.imageScale;

      if (mouseX >= this.imageX && mouseX <= this.imageX + scaledWidth &&
        mouseY >= this.imageY && mouseY <= this.imageY + scaledHeight) {
        this.dragging = true;
        this.offsetX = mouseX - this.imageX;
        this.offsetY = mouseY - this.imageY;
      }
    }

    if (event.touches.length === 2) {
      this.dragging = false; // Disable dragging when scaling
      this.initialDistance = this.getTouchDistance(event.touches);
    }
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();  // Prevent default behavior

    if (event.touches.length === 1 && this.dragging) {
      const touch = event.touches[0];
      const mouseX = touch.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
      const mouseY = touch.clientY - this.canvas.nativeElement.getBoundingClientRect().top;

      this.imageX = mouseX - this.offsetX;
      this.imageY = mouseY - this.offsetY;
      this.drawImages();
    }

    if (event.touches.length === 2) {
      const newDistance = this.getTouchDistance(event.touches);
      const scaleChange = newDistance / this.initialDistance;
      this.imageScale = Math.max(this.minScale, this.imageScale * scaleChange);  // Ensure scale doesn't go below minScale
      this.initialDistance = newDistance;
      this.drawImages();
    }
  }

  endTouch() {
    this.dragging = false;
  }

  getTouchDistance(touches: TouchList): number {
    const [touch1, touch2] = [touches[0], touches[1]];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }

  downloadImage() {
    const link = document.createElement('a');
    link.download = 'Azconf.png';
    link.href = this.canvas.nativeElement.toDataURL('image/png', 1.0);
    link.click();
  }
}
