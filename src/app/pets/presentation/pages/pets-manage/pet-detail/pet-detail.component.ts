import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { PetsService } from '../../../services/pets.service';
import { Pet } from '../../../../domain';
import { FileService } from '../../../../../shared';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTabsModule],
  templateUrl: './pet-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetDetailComponent implements OnInit {
  private localtion = inject(Location);
  private petService = inject(PetsService);
  private fileServce = inject(FileService);
  @Input('id') petId?: string;

  pet = signal<Pet | null>(null);
  url = signal<string | null>(null);

  ngOnInit(): void {
    this.petService.getDetail(this.petId!).subscribe((pet) => {
      this.pet.set(pet);
    });
  }

  back() {
    this.localtion.back();
  }

  private _getimage(url: string) {
    this.fileServce.getFile(url).subscribe((blob) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.url.set(e.target.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
