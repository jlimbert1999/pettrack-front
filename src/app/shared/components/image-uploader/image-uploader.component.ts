import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Platform, PlatformModule } from '@angular/cdk/platform';

import { FileService } from '../../services/file.service';

@Component({
  selector: 'image-uploader',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, PlatformModule],
  template: `
    <div class="flex flex-col ">
      @if(url()){
      <figure class="flex justify-center items-center rounded-2xl">
        <img
          [src]="url()"
          alt="Image preview"
          class="object-contain max-h-[250px] rounded-2xl"
        />
      </figure>
      }
      <div class="flex items-center justify-center py-2">
        <div class="text-lg mr-4">imagen</div>
        <div class="flex gap-x-2">
          <input
            #cameraInput
            hidden
            type="file"
            accept="image/*"
            capture="environment"
            (change)="select($event)"
          />

          <input
            #galleryInput
            hidden
            type="file"
            accept="image/*"
            (change)="select($event)"
          />
          <button
            mat-icon-button
            type="button"
            (click)="cameraInput.click()"
            matTooltip="Tomar foto"
          >
            <mat-icon>photo_camera</mat-icon>
          </button>

          <button
            mat-icon-button
            type="button"
            (click)="galleryInput.click()"
            matTooltip="Seleccionar de la galería"
          >
            <mat-icon>photo_library</mat-icon>
          </button>

          @if(url()){
          <button
            mat-icon-button
            aria-label="Remove image"
            matTooltip="Remover imagen"
            type="button"
            (click)="remove()"
          >
            <mat-icon>close</mat-icon>
          </button>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploaderComponent implements OnInit {
  private platform = inject(Platform);
  private postService = inject(FileService);
  cameraInput = viewChild.required<ElementRef<HTMLInputElement>>('cameraInput');
  galleryInput =
    viewChild.required<ElementRef<HTMLInputElement>>('galleryInput');

  preview = input<string | null | undefined>(null);
  secure = input<boolean>(false);
  onImageRemoved = output<void>();

  url = signal<string | null>(null);
  file = model<File | undefined>();

  enablePhoto = this.platform.ANDROID || this.platform.IOS;

  ngOnInit(): void {
    if (!this.preview()) return;
    if (this.secure()) {
      this.postService.getFile(this.preview()!).subscribe((blob) => {
        this._setImagePreview(blob);
      });
    }
    else {
      this.url.set(this.preview()!);
    }
  }

  select(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const image = inputElement.files?.[0];
    if (!image) return;
    this.file.set(image);
    this._setImagePreview(image);
  }

  remove(): void {
    this.file.set(undefined);
    this.url.set(null);
    this.cameraInput().nativeElement.value = '';
    this.galleryInput().nativeElement.value = '';
    this.onImageRemoved.emit();
  }

  private _setImagePreview(blob: Blob) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.url.set(e.target.result);
    };
    reader.readAsDataURL(blob);
  }
}
