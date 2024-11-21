import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'image-loader',
  standalone: true,
  imports: [],
  template: `
    <img
      [src]="previewUrl()"
      alt="Image preview"
      class="object-contain max-h-96 rounded-2xl"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageLoaderComponent implements OnInit {
  url = input.required<string | null>();
  private fileService = inject(FileService);

  previewUrl = signal<string>('images/no-image.jpg');

  constructor() {
    effect(() => {
      // this._getImage();
    });
  }

  ngOnInit(): void {}

  private _getImage() {
    if (!this.url()) {
      this.previewUrl.set('images/no-image.jpg');
      return;
    } else {
      this.fileService.getFile(this.url()!).subscribe((blob) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrl.set(e.target.result);
        };
        reader.readAsDataURL(blob);
      });
    }
  }
}
