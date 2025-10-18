export interface MovementReportDto {
  id: number;
  date: Date;
  name: string;
  number: string;
  type: string;
  state: boolean;
  initBalance: number;
  movement: number;
  balance: number;
}

export interface MovementReportQuery {
  startDate: string;
  endDate: string;
  clientId?: number;
}