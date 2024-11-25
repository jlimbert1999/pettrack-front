import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { ImageLoaderComponent } from '../../../../../shared';
import { PetsService } from '../../../services';
import { Pet } from '../../../../domain';

@Component({
    selector: 'app-pet-detail',
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatProgressBarModule,
        ImageLoaderComponent,
    ],
    templateUrl: './pet-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PetDetailComponent implements OnInit {
  private location = inject(Location);
  private petService = inject(PetsService);

  @Input('id') petId: string;
  pet = signal<Pet | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.petService.getDetail(this.petId).subscribe((pet) => {
      this.pet.set(pet);
      this.isLoading.set(false);
    });
  }

  back() {
    this.location.back();
  }
}
