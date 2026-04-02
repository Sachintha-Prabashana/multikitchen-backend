import prisma from '../lib/prisma.js';

export const saveMessage = async (sender_name, message) => {
  return await prisma.message.create({ data: { sender_name, message } });
};

export const getAllMessages = async () => {
  return await prisma.message.findMany({ orderBy: { created_at: 'desc' } });
};

export const replyToMessage = async (id, reply) => {
  return await prisma.message.update({
    where: { message_id: parseInt(id) },
    data: { reply, status: 'REPLIED' },
  });
};
