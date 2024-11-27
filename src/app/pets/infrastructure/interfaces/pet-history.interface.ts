import {
  medicalCenter,
  typeTreatment,
} from '../../../administration/infrastructure';

export interface treatment {
  id: number;
  date: string;
  typeTreatment: typeTreatment;
  medicalCenter: medicalCenter;
}
