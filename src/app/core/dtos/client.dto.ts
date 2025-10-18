export interface ClientDto {
  id: number;
  name: string;
  gender: 'M' | 'F' | 'Otro';
  birthdate: string
  personId: string;
  address: string;
  phone: string;
  state: boolean;
}