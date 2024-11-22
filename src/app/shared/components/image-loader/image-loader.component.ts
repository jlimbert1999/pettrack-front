import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'image-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    @if(isLoading()){
    <mat-spinner />
    } @else {
    <img
      [src]="previewUrl()"
      alt="Image preview"
      class="object-contain max-h-96 rounded-2xl"
    />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageLoaderComponent implements OnInit {
  private fileService = inject(FileService);
  private destroyRef = inject(DestroyRef);
  url = input.required<string | null>();

  previewUrl = signal<string>('images/no-image.jpg');
  isLoading = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => {
      URL.revokeObjectURL(this.previewUrl());
    });
  }
  ngOnInit(): void {
    this._getImage();
  }

  private _getImage() {
    if (!this.url()) return;
    this.fileService.getFile(this.url()!).subscribe({
      next: (value) => this.previewUrl.set(URL.createObjectURL(value)),
      error: () => this.previewUrl.set('images/no-image.jpg'),
      complete: () => this.isLoading.set(false),
    });
  }
}
