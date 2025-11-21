interface ownerProps {
  readonly id: string;
  first_name: string;
  middle_name: string;
  last_name: string | null;
  dni: string;
  address: string;
  phone: string;
  createdAt: Date;
  district: district;
  birthDate: Date;
}
interface district {
  readonly id: number;
  readonly name: string;
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
    this.district = district;
    this.birthDate = birthDate;
  }

  get fullname() {
    return `${this.first_name} ${this.middle_name} ${this.last_name}`.trim();
  }

  get phoneNumber() {
    return this.phone || '----';
  }
}
