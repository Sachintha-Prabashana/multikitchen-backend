import prisma from '../lib/prisma.js';

export const getAllItems = async () => {
  return await prisma.item.findMany({
    include: { brand: true }
  });
};

export const createNewItem = async (data) => {
  const { brand_name, ...itemData } = data;
  if (brand_name) {
    const brand = await prisma.brand.upsert({
      where: { name: brand_name.trim() },
      update: {},
      create: { name: brand_name.trim() }
    });
    itemData.brand_id = brand.id;
  }
  return await prisma.item.create({ data: itemData });
};

export const updateExistingItem = async (id, data) => {
  const { brand_name, ...itemData } = data;
  if (brand_name) {
    const brand = await prisma.brand.upsert({
      where: { name: brand_name.trim() },
      update: {},
      create: { name: brand_name.trim() }
    });
    itemData.brand_id = brand.id;
  } else if (brand_name === null) {
      itemData.brand_id = null;
  }
  
  return await prisma.item.update({
    where: { item_id: parseInt(id) },
    data: itemData,
    include: { brand: true }
  });
};

export const deleteExistingItem = async (id) => {
  return await prisma.item.delete({ where: { item_id: parseInt(id) } });
};
