export type Event = {
  id: number;
  title: string;
  description?: string;
  organizerId: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  walletAddress: string;
};
