import mongoose from "mongoose";
import TicketModel from "../../config/models/ticket.model.js";

export default class TicketDAO {
  async create(ticketData) {
    return await TicketModel.create(ticketData); //? Crea un ticket
  }

  async getAll() {
    return await TicketModel.find().lean(); //? Devuelve todos los tickets (opcional para admin)
  }

  async getByCode(code) {
    return await TicketModel.findOne({ code }).lean(); //? Busca por código único (opcional)
  }

  async getByEmail(email) {
    return await TicketModel.find({ purchaser: email }).lean(); //? Busca todos los tickets de un comprador
  }

  async isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id); //? Por si acaso necesitas validar algo externo
  }
}
