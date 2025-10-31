import { Pet } from '../../domain/models/pet.model';
import { OwnerMapper, pet } from '..';

export class PetMapper {
  static fromResponse({
    createdAt,
    birthDate,
    neuter_date,
    owner,
    image,
    ...props
  }: pet): Pet {
    return new Pet({
      ...props,
      owner: owner ? OwnerMapper.fromResponse(owner) : undefined,
      createdAt: new Date(createdAt),
      birthDate: birthDate ? new Date(birthDate) : null,
      neuter_date: neuter_date ? new Date(neuter_date) : null,
      image: image,
    });
  }
}
