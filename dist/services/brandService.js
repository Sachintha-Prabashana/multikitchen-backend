import prisma from '../lib/prisma.js';
export const getBrands = async () => {
    return await prisma.brand.findMany({
        orderBy: { name: 'asc' }
    });
};
export const createBrand = async (name) => {
    return await prisma.brand.upsert({
        where: { name: name.trim() },
        update: {},
        create: { name: name.trim() }
    });
};
