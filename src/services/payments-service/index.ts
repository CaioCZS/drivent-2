import paymentRepository from '../../repositories/payments-repository';
import { PaymentBody } from '@/schemas/payments-schema';

async function getPayment(ticketId: number) {
  return paymentRepository.find(ticketId);
}

async function createPayment(data: PaymentBody, value: number) {
  return paymentRepository.create(data, value);
}

const paymentService = {
  getPayment,
  createPayment,
};

export default paymentService;
