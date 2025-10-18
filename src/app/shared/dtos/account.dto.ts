export interface AccountDto {
  id: number;
  number: string;
  type: string;
  initBalance: number;
  state: boolean;
  clientId: number;
  clientName?: string;
}

export interface AccountRequest {
  number: string;
  type: string;
  initBalance: number;
  clientId: number;
  state: boolean;
}