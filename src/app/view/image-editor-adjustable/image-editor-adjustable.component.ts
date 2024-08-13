import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxCroppedEvent, NgxPhotoEditorService } from 'ngx-photo-editor';

@Component({
  selector: 'app-image-editor-adjustable',
  templateUrl: './image-editor-adjustable.component.html',
  styleUrls: ['./image-editor-adjustable.component.scss']
})
export class ImageEditorAdjustableComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  constructor(private service: NgxPhotoEditorService) {}

  private ctx!: CanvasRenderingContext2D;
  private templateImage = new Image();
  private uploadedImage = new Image();

  private imageX = 545;
  private imageY = 190;
  private dragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private imageScale = 1.3;
  private initialDistance = 0;

  private lastTouchX = 0;
  private lastTouchY = 0;
  private moveThreshold = 5; // Reduced threshold for smoother dragging


private readonly minScale = 0;  

   isImageUploaded = false;
   displayCanvas="none";
  ngOnInit() {
   this.loadcanvas();
  }


  loadcanvas()
  {
    this.templateImage.src = 'assets/board2.png';
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
 
    this.service.open(event.target.files[0], {
      aspectRatio: 4 / 3,
      autoCropArea: 1
    }).subscribe((croppedEvent: NgxCroppedEvent) => {
      const croppedImageDataUrl = croppedEvent.base64; // Assuming you have base64 data
      this.displayCanvas="block";

      const reader = new FileReader();
      reader.onload = (e: any) => {
        
        this.uploadedImage.src = e.target.result;
        this.uploadedImage.onload = () => {
          this.drawImages();
        };

        this.isImageUploaded=true;

      };
  
      // Convert base64 to Blob if needed
      const blob = this.dataURLToBlob(croppedImageDataUrl);
      reader.readAsDataURL(blob); // You can now use the Blob as expected
    });


    // const file = event.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     this.uploadedImage.src = e.target.result;
    //     this.uploadedImage.onload = () => {
    //       this.drawImages();
    //     };
    //   };
    //   reader.readAsDataURL(file);
    // }
  }

  dataURLToBlob(dataURL:any): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }


  removeImage()
  {
    
  }

  fileChangeHandler($event: any) {
    this.service.open($event, {
      aspectRatio: 4 / 3,
      autoCropArea: 1
    }).subscribe(data => {
      // this.output = data;
    });
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

  // onMouseWheel(event: WheelEvent) {
  //   event.preventDefault();  // Prevent page scrolling on scale
  //   const scaleChange = event.deltaY > 0 ? -0.1 : 0.1;
  //   this.imageScale = Math.max(0.1, this.imageScale + scaleChange);
  //   this.drawImages();
  // }

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
      const scaledWidth = 350 * this.imageScale;
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

  // onTouchMove(event: TouchEvent) {
  //   event.preventDefault();  // Prevent default behavior

  //   if (event.touches.length === 1 && this.dragging) {
  //     const touch = event.touches[0];
  //     const mouseX = touch.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
  //     const mouseY = touch.clientY - this.canvas.nativeElement.getBoundingClientRect().top;

  //     this.imageX = mouseX - this.offsetX;
  //     this.imageY = mouseY - this.offsetY;
  //     this.drawImages();
  //   }

  //   if (event.touches.length === 2) {
  //     const newDistance = this.getTouchDistance(event.touches);
  //     const scaleChange = newDistance / this.initialDistance;
  //     this.imageScale *= scaleChange;
  //     this.imageScale = Math.max(0.1, this.imageScale);
  //     this.initialDistance = newDistance;
  //     this.drawImages();
  //   }
  // }


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
