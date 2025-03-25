export interface captureLog {
  id: number;
  date: Date;
  location: string;
  description: string;
  user: user;
}

interface user {
  fullname: string;
}
