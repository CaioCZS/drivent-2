import paymentRepository from '../../repositories/payments-repository';

async function getPayment(ticketId: number) {
  return paymentRepository.find(ticketId);
}

const paymentService = {
  getPayment,
};

export default paymentService;
