export interface pet {
  id: string;
  name: string;
  code: number;
  age: number;
  species: string;
  image: null;
  breed: string;
  color: string;
  sex: string;
  createdAt: Date;
  description: string;
  is_neutered: boolean;
  neuter_date: null;
  owner: partialOwner;
}

interface partialOwner {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string | null;
  dni: string;
  address: string;
  phone: string;
  createdAt: Date;
}
