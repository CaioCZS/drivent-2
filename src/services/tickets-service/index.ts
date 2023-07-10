import ticketRepository from '../../repositories/tickets-repository';

async function getAllTicketTypes() {
  return ticketRepository.findMany();
}

const ticketsService = {
  getAllTicketTypes,
};

export default ticketsService;
