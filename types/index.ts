export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  groupId: string;
  amount: number;
  description: string;
  paidBy: string;
  splitBetween: string[];
  createdAt: Date;
}
