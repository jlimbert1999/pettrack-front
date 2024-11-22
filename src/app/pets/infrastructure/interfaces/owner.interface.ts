export interface owner {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string | null;
  dni: string;
  address: string;
  phone: string;
  createdAt: string;
  pets: partialPet[];
}

interface partialPet {
  id: string;
  name: string;
  code: number;
  species: string;
  image: null | string;
  color: string;
  sex: string;
  createdAt: string;
  description: string;
  is_neutered: boolean;
  neuter_date: Date | null;
  breed: partialBreed;
  birthDate: string;
}

interface partialBreed {
  id: number;
  name: string;
  species: string;
}
