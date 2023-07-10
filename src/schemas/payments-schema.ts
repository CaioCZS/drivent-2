import Joi from 'joi';

type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

export type PaymentBody = {
  ticketId: number;
  cardData: CardData;
};
