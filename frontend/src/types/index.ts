export type BaseEvent = {
  id: number;
  organizerId: number;
  title: string;
  description?: string;
  organizer: User;
};

export type Event = BaseEvent & {
  soldOut: boolean;
};

export type AdminEvent = BaseEvent & {
  ticketCount: number;
  ticketSold: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  walletAddress: string;
};

export type Ticket = {
  id: number;
  art?: string;
  number: number;
  tier: string;
  eventId: number;
};

export type PrismaError<T extends string = string> = {
  code: string;
  clientVersion: string;
  meta: {
    target: T[];
  };
};
