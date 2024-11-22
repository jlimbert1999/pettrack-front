interface petProps {
  id: string;
  name: string;
  code: number;
  species: string;
  image: null | string;
  breed: breed;
  color: string;
  sex: string;
  createdAt: Date;
  description: string;
  is_neutered: boolean;
  neuter_date: null;
  owner: onwer;
  birthDate: Date;
}

interface onwer {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string | null;
  dni: string;
  address: string;
  phone: string;
  createdAt: Date;
}

interface breed {
  name: string;
  species: string;
}

export class Pet implements petProps {
  id: string;
  name: string;
  code: number;
  age: number;
  species: string;
  image: null | string;
  breed: breed;
  color: string;
  sex: string;
  createdAt: Date;
  description: string;
  is_neutered: boolean;
  neuter_date: null;
  owner: onwer;
  birthDate: Date;

  constructor({
    id,
    name,
    code,
    species,
    image,
    breed,
    color,
    sex,
    createdAt,
    description,
    is_neutered,
    neuter_date,
    owner,
  }: petProps) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.species = species;
    this.image = image;
    this.breed = breed;
    this.color = color;
    this.sex = sex;
    this.createdAt = createdAt;
    this.description = description;
    this.is_neutered = is_neutered;
    this.neuter_date = neuter_date;
    this.owner = owner;
  }

  get fullnameOwner() {
    return `${this.owner.first_name} ${this.owner.middle_name} ${this.owner.last_name}`;
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
