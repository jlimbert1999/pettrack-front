import { Pet } from '../../domain/models/pet.model';
import { pet } from '../interfaces/pet.interface';

export class PetMapper {
  static fromResponse({ createdAt, birthDate, ...props }: pet): Pet {
    return new Pet({
      ...props,
      createdAt: new Date(createdAt),
      birthDate: new Date(birthDate),
    });
  }
}
