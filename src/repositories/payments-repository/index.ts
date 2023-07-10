import { Payment } from '@prisma/client';
import { prisma } from '../../config';
import { PaymentBody } from '@/schemas/payments-schema';

async function find(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function create(data: PaymentBody, value: number) {
  const { ticketId, cardData } = data;
  const creditNumberStr = cardData.number.toString();

  return await prisma.payment.create({
    data: {
      value,
      cardIssuer: cardData.issuer,
      cardLastDigits: creditNumberStr.slice(-4),
      ticketId,
      updatedAt: new Date(),
    },
  });
}

const paymentRepository = {
  find,
  create,
};

export default paymentRepository;
