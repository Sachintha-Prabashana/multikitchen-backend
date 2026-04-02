import prisma from '../lib/prisma.js';

export const issueStock = async (item_id, quantity, user_id) => {
  const item = await prisma.item.findUnique({ where: { item_id: parseInt(item_id) } });
  if (!item) throw new Error('Item not found');
  if (item.quantity < quantity) throw new Error('Insufficient stock');

  const updatedItem = await prisma.item.update({
    where: { item_id: parseInt(item_id) },
    data: { quantity: { decrement: parseInt(quantity) } },
  });

  const transaction = await prisma.transaction.create({
    data: {
      item_id: parseInt(item_id),
      type: 'ISSUE',
      quantity: parseInt(quantity),
      user_id,
    },
  });

  return { item: updatedItem, transaction };
};

export const receiveStock = async (item_id, quantity, user_id) => {
  const item = await prisma.item.findUnique({ where: { item_id: parseInt(item_id) } });
  if (!item) throw new Error('Item not found');

  const updatedItem = await prisma.item.update({
    where: { item_id: parseInt(item_id) },
    data: { quantity: { increment: parseInt(quantity) } },
  });

  const transaction = await prisma.transaction.create({
    data: {
      item_id: parseInt(item_id),
      type: 'RECEIVE',
      quantity: parseInt(quantity),
      user_id,
    },
  });

  return { item: updatedItem, transaction };
};

export const batchIssueStock = async (items, worker_name, user_id) => {
  return await prisma.$transaction(async (tx) => {
    const results = [];
    for (const itemData of items) {
      const item_id = parseInt(itemData.item_id);
      const quantity = parseInt(itemData.quantity);

      const item = await tx.item.findUnique({ where: { item_id } });
      if (!item) throw new Error(`Item ID ${item_id} not found`);
      if (item.quantity < quantity) throw new Error(`Insufficient stock for ${item.item_name}`);

      const updatedItem = await tx.item.update({
        where: { item_id },
        data: { quantity: { decrement: quantity } },
      });

      const transaction = await tx.transaction.create({
        data: {
          item_id,
          type: 'ISSUE',
          quantity,
          user_id,
          worker_name,
        },
      });
      results.push({ item: updatedItem, transaction });
    }
    return results;
  });
};

export const batchReceiveStock = async (items, user_id) => {
  return await prisma.$transaction(async (tx) => {
    const results = [];
    for (const itemData of items) {
      const item_id = parseInt(itemData.item_id);
      const quantity = parseInt(itemData.quantity);

      const item = await tx.item.findUnique({ where: { item_id } });
      if (!item) throw new Error(`Item ID ${item_id} not found`);

      const updatedItem = await tx.item.update({
        where: { item_id },
        data: { quantity: { increment: quantity } },
      });

      const transaction = await tx.transaction.create({
        data: {
          item_id,
          type: 'RECEIVE',
          quantity,
          user_id,
        },
      });
      results.push({ item: updatedItem, transaction });
    }
    return results;
  });
};

export const getTransactionHistory = async () => {
  return await prisma.transaction.findMany({
    include: { item: true, user: true },
    orderBy: { date: 'desc' },
  });
};

export const getLowStockItems = async () => {
  const allItems = await prisma.item.findMany();
  return allItems.filter(item => item.quantity < item.min_quantity);
};
