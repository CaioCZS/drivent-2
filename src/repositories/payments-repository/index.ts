import { prisma } from '../../config';

async function find(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

const paymentRepository = {
  find,
};

export default paymentRepository;
