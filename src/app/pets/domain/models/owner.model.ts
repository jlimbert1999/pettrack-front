interface ownerProps {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string | null;
  dni: string;
  address: string;
  phone: string;
  createdAt: Date;
  pets: pet[];
  district: district;
  birthDate: Date;
}
interface pet {
  id: string;
  name: string;
  code: number;
  species: string;
  image: null | string;
  color: string;
  sex: string;
  createdAt: Date;
  birthDate: Date;
  description: string;
  is_neutered: boolean;
  neuter_date: Date | null;
  breed: breed;
}

interface breed {
  id: number;
  name: string;
  species: string;
}

interface district {
  id: number;
  name: string;
}

export class Owner implements ownerProps {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string | null;
  dni: string;
  address: string;
  phone: string;
  createdAt: Date;
  pets: pet[];
  district: district;
  birthDate: Date;

  constructor({
    id,
    first_name,
    middle_name,
    last_name,
    dni,
    address,
    phone,
    createdAt,
    pets,
    district,
    birthDate,
  }: ownerProps) {
    this.id = id;
    this.first_name = first_name;
    this.middle_name = middle_name;
    this.last_name = last_name;
    this.dni = dni;
    this.address = address;
    this.phone = phone;
    this.createdAt = createdAt;
    this.pets = pets;
    this.district = district;
    this.birthDate = birthDate;
  }

  get fullname() {
    return `${this.first_name} ${this.middle_name} ${this.last_name}`;
  }
}
