import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// In the createTicket function
export const createTicket = async (req, res) => {
  const { title, description } = req.body;
  const creatorId = req.user.id;

  const slaDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        status: 'IN_PROGRESS',
        creatorId,
        slaDeadline,
        timeline: [{
          action: 'CREATED',
          timestamp: new Date(),
          actor: req.user.name,
          details: 'Ticket was created.'
        }]
      },
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create ticket', error: error.message });
  }
};

// Get tickets with filters, search, and pagination
export const getTickets = async (req, res) => {
  const { limit = 10, offset = 0, status, search } = req.query;
  const { id: userId, role } = req.user;

  let where = {};

  // Role-based access
  if (role === 'USER') {
    where.creatorId = userId;
  }
  
  // Status filter
  if (status) {
    where.status = status;
  }
  
  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
      include: { creator: { select: { name: true } } }
    });
    const totalTickets = await prisma.ticket.count({ where });
    res.json({ tickets, total: totalTickets, pages: Math.ceil(totalTickets / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
};

// Get a single ticket by ID
export const getTicketById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: { select: { name: true, email: true } },
        agent: { select: { name: true, email: true } },
        comments: {
          include: { author: { select: { name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (role === 'USER' && ticket.creatorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ticket', error: error.message });
  }
};

// Update a ticket (Optimistic Locking)
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, agentId, version } = req.body;
  
  if (!version) {
    return res.status(400).json({ message: 'Version is required for update.' });
  }

  try {
    // Optimistic Locking: WHERE clause checks both ID and version
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: id,
        version: parseInt(version),
      },
      data: {
        status,
        agentId,
        version: { increment: 1 }, // Increment version on successful update
        timeline: { push: {
          action: 'UPDATED',
          timestamp: new Date(),
          actor: req.user.name,
          details: `Status changed to ${status}.`
        }}
      },
    });
    res.json(updatedTicket);
  } catch (error) {
    // Prisma throws P2025 error if record to update is not found (ID or version mismatch)
    if (error.code === 'P2025') {
      return res.status(409).json({ message: 'Conflict: Ticket has been updated by someone else. Please refresh and try again.' });
    }
    res.status(500).json({ message: 'Failed to update ticket', error: error.message });
  }
};

// Add a comment to a ticket
export const addComment = async (req, res) => {
  const { id: ticketId } = req.params;
  const { text } = req.body;
  const authorId = req.user.id;
  
  try {
    const comment = await prisma.comment.create({
      data: { text, authorId, ticketId },
      include: { author: { select: { name: true, role: true } } }
    });

    await prisma.ticket.update({
        where: { id: ticketId },
        data: {
            timeline: { push: {
                action: 'COMMENT',
                timestamp: new Date(),
                actor: req.user.name,
                details: `Added a new comment.`
            }}
        }
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add comment', error: error.message });
  }
};