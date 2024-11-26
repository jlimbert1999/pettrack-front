import { Owner } from '../../domain';
import { owner } from '../interfaces/owner.interface';

export class OwnerMapper {
  static fromResponse({ createdAt, birthDate, pets, ...props }: owner): Owner {
    return new Owner({
      ...props,
      createdAt: new Date(createdAt),
      birthDate: new Date(birthDate),
      pets: pets.map(({ birthDate, createdAt, ...props }) => ({
        ...props,
        birthDate: new Date(birthDate),
        createdAt: new Date(createdAt),
      })),
    });
  }
}
