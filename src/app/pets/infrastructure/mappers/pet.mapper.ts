import { Pet } from '../../domain/models/pet.model';
import { pet } from '../interfaces/pet.interface';

export class PetMapper {
  static fromResponse(response: pet): Pet {
    return new Pet(response);
  }
}
