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
}
interface pet {
  id: string;
  name: string;
  code: number;
  age: number;
  species: string;
  image: null | string;
  breed: string;
  color: string;
  sex: string;
  createdAt: Date;
  description: string;
  is_neutered: boolean;
  neuter_date: Date | null;
}

export class Owner {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string | null;
  dni: string;
  address: string;
  phone: string;
  createdAt: Date;
  pets: pet[];

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
  }

  get fullname() {
    return `${this.first_name} ${this.middle_name} ${this.last_name}`;
  }
}
