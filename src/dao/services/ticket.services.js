import TicketRepository from "../../repositories/ticket.repository.js";

const ticketRepository = new TicketRepository();

export default class TicketService {
  async createTicket(ticketData) {
    return await ticketRepository.createTicket(ticketData); //? Crear un nuevo ticket
  }

  async getAllTickets() {
    return await ticketRepository.getAllTickets(); //? Obtener todos los tickets (opcional)
  }

  async getTicketByCode(code) {
    return await ticketRepository.getTicketByCode(code); //? Buscar ticket por su código
  }

  async getTicketsByEmail(email) {
    return await ticketRepository.getTicketsByEmail(email); //? Todos los tickets de un comprador
  }

  async isValidId(id) {
    return await ticketRepository.isValidId(id); //? Validación estándar de ObjectId
  }
}
