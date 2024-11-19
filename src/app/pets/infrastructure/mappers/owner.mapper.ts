import { Owner } from '../../domain';
import { owner } from '../interfaces/owner.interface';

export class OwnerMapper {
  static fromResponse(response: owner): Owner {
    return new Owner(response);
  }
}
