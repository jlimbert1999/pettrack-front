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
    <div class="flex flex-col">
      @if(url()){
      <figure class="flex justify-center items-center rounded-2xl px-4">
        <img
          [src]="url()"
          alt="Image preview"
          class="object-contain max-h-96 rounded-2xl"
        />
      </figure>
      }
      <div class="flex items-center justify-center">
        <div class="text-lg mr-4">Imagen</div>
        <div class="flex gap-x-2">
          @if(enablePhoto){
          <button
            mat-icon-button
            aria-label="Select photo"
            (click)="photoInput.click()"
            matTooltip="Seleccionar foto"
          >
            <mat-icon>photo_camera</mat-icon>
          </button>
          <input
            #photoInput
            [hidden]="true"
            type="file"
            [multiple]="false"
            accept="image/png, image/jpeg, image/jpg"
            (change)="select($event)"
            capture="camera"
          />
          }

          <button
            mat-icon-button
            aria-label="Select image"
            (click)="imageInput.click()"
            matTooltip="Seleccionar imagen"
          >
            <mat-icon>image_search</mat-icon>
          </button>
          <input
            #imageInput
            [hidden]="true"
            type="file"
            [multiple]="false"
            accept="image/png, image/jpeg, image/jpg"
            (change)="select($event)"
          />
          @if(url()){
          <button
            mat-icon-button
            aria-label="Remove image"
            matTooltip="Remover imagen"
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
  platform = inject(Platform);
  private postService = inject(FileService);
  imageInput = viewChild.required<ElementRef<HTMLInputElement>>('imageInput');

  preview = input<string | null | undefined>(null);
  onImageRemoved = output<void>();

  url = signal<string | null>(null);
  file = model<File | undefined>();

  enablePhoto = this.platform.ANDROID || this.platform.IOS;

  ngOnInit(): void {
    if (!this.preview()) return;
    this.postService.getFile(this.preview()!).subscribe((blob) => {
      this._setImagePreview(blob);
    });
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
    this.imageInput().nativeElement.value = '';
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
