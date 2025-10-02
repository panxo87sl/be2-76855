import TicketDAO from "../dao/models/ticket.dao.js";

const ticketDAO = new TicketDAO();

export default class TicketRepository {
  async createTicket(ticketData) {
    return await ticketDAO.create(ticketData);
  }

  async getAllTickets() {
    return await ticketDAO.getAll();
  }

  async getTicketByCode(code) {
    return await ticketDAO.getByCode(code);
  }

  async getTicketsByEmail(email) {
    return await ticketDAO.getByEmail(email);
  }

  //? Validar si un ID es válido (para rutas con :id)
  async isValidId(id) {
    return await ticketDAO.isValidId(id);
  }
}
