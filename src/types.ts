export interface RequestItem {
  id: string;
  title: string;
  amount: number;
  who: string;
  childId: string;
  when: string;
  icon: string;
  desc: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  icon?: string;
  spent: number;
  limit: number;
  color?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  current: number;
  target: number;
}

export interface ParentAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  role: 'parent' | 'student';
  userId: string;
  name: string;
  email: string;
  avatar: string;
}

export interface ChildAccount {
  id: string;
  name: string;
  email?: string;
  password?: string;
  age: number;
  avatar: string;
  allowance: number;
  spent: number;
  saved: number;
  balance: number;
  foodSpent: number;
  foodLimit: number;
  transportSpent: number;
  transportLimit: number;
  streakDays: number;
  challengeCompleted: boolean;
  goals: SavingsGoal[];
  budgets: BudgetItem[];
  requests: RequestItem[];
  walletHistory: string[];
}

export interface AppState {
  children: ChildAccount[];
  activeChildId: string;
  parent: ParentAccount;
  session: UserSession;
}
