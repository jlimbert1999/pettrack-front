export interface owner {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string | null;
  dni: string;
  address: string;
  phone: string;
  createdAt: string;
  pets: pet[];
  district: district;
  birthDate: string;
}

interface district {
  id: number;
  name: string;
}

export interface pet {
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
  neuter_date: string | null;
  owner?: owner;
  breed: breed;
  birthDate: string | null;
}

interface breed {
  id: number;
  name: string;
  species: string;
}
