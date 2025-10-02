import { Router } from "express";
import TicketService from "../dao/services/ticket.services.js";
import { requireJwtCookie } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/policies.middleware.js";

const router = Router();
const ticketService = new TicketService();

//?GET /api/v1/tickets - Todos los tickets (solo admin)
router.get("/", requireJwtCookie, requireRole("admin"), async (request, response) => {
  try {
    const tickets = await ticketService.getAllTickets();
    response
      .status(200)
      .json({ message: "Tickets encontrados", payload: { tickets: tickets } });
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

//?GET /api/v1/tickets/mytickets - Tickets del usuario autenticado (cualquier rol)
router.get("/mytickets", requireJwtCookie, async (request, response) => {
  try {
    const auxEmail = request.user.email;
    const auxTickets = await ticketService.getTicketsByEmail(auxEmail);

    response
      .status(200)
      .json({ message: "Tickets del usuario", payload: { tickets: auxTickets } });
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

//?GET /api/v1/tickets/:code - Ticket por código (solo admin)
router.get("/:code", requireJwtCookie, requireRole("admin"), async (request, response) => {
  try {
    const { code } = request.params;
    const auxTicket = await ticketService.getTicketByCode(code);

    if (!auxTicket) {
      return response
        .status(404)
        .json({ error: "Ticket no encontrado", message: "Código no válido o inexistente" });
    }

    response
      .status(200)
      .json({ message: "Ticket encontrado", payload: { ticket: auxTicket } });
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

export default router;
