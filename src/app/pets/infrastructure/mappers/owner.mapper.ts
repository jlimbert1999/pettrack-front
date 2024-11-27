import { owner } from '..';
import { Owner } from '../../domain';

export class OwnerMapper {
  static fromResponse({ createdAt, birthDate, ...props }: owner): Owner {
    return new Owner({
      ...props,
      createdAt: new Date(createdAt),
      birthDate: new Date(birthDate),
    });
  }
}
