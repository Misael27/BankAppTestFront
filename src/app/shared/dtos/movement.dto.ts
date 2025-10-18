export interface MovementDto {
  id: number;
  date: Date;
  type: string;
  value: number;
  balance: number;
  accountId: number;
  accountNumber?: string;
  clientName?: string;
}

export interface MovementRequest {
  accountId: number;
  type: string;
  value: number;
}