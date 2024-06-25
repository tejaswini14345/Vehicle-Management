export interface Transaction {
  transaction_id: string;
  user_id: string;
  vehicle_id: string;
  transaction_date: string;
  transaction_type: string; // 'Completed', 'In-Progress', or any other type
  status: string;
  make?: string;
  model?: string;
  color?: string;
  year?: string;
}
