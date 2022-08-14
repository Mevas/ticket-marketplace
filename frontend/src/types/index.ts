export type Event = {
  id: number;
  organizerId: number;
  title: string;
  description?: string;
  organizer: User;
};

export type AdminEvent = Event & {
  ticketCount: number;
  ticketSold: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  walletAddress: string;
};

export type PrismaError<T extends string = string> = {
  code: string;
  clientVersion: string;
  meta: {
    target: T[];
  };
};
