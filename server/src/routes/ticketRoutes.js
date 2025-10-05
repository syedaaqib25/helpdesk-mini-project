import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
} from '../controllers/ticketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('USER'), createTicket)
  .get(protect, getTickets);

router.route('/:id')
  .get(protect, getTicketById)
  .patch(protect, authorize('AGENT', 'ADMIN'), updateTicket);

router.route('/:id/comments')
  .post(protect, addComment);

export default router;