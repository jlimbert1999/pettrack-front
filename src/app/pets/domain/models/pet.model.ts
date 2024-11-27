import type { Owner } from './owner.model';

interface petProps {
  readonly id: string;
  name: string;
  code: number;
  image: null | string;
  breed: breed;
  color: string;
  sex: string;
  createdAt: Date;
  description: string;
  is_neutered: boolean;
  neuter_date: Date | null;
  birthDate: Date | null;
  owner?: Owner;
}

interface breed {
  readonly id: number;
  readonly name: string;
  readonly species: string;
}

export class Pet {
  id: string;
  name: string;
  code: number;
  image: null | string;
  breed: breed;
  color: string;
  sex: string;
  createdAt: Date;
  description: string;
  is_neutered: boolean;
  neuter_date: Date | null;
  birthDate: Date | null;
  owner?: Owner;

  constructor({
    id,
    name,
    code,
    image,
    breed,
    color,
    sex,
    createdAt,
    description,
    is_neutered,
    neuter_date,
    owner,
    birthDate,
  }: petProps) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.image = image;
    this.breed = breed;
    this.color = color;
    this.sex = sex;
    this.createdAt = createdAt;
    this.description = description;
    this.is_neutered = is_neutered;
    this.neuter_date = neuter_date;
    this.owner = owner;
    this.birthDate = birthDate;
  }

  calculateAge(): string {
    if (!this.birthDate) return 'Sin registro';
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    const mes = today.getMonth() - this.birthDate.getMonth();
    if (mes < 0 || (mes === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age.toString();
  }
}
