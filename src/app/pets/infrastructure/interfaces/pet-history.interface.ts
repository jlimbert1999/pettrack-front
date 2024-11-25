import {
  medicalCenter,
  typeTreatment,
} from '../../../administration/infrastructure';

export interface petHistory {
  id: number;
  date: string;
  typeTreatment: typeTreatment;
  medicalCenter: medicalCenter;
}
