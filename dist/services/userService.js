import prisma from '../lib/prisma.js';
export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: { user_id: true, name: true, email: true, role: true, created_at: true },
    });
};
export const updateUserRole = async (id, role) => {
    return await prisma.user.update({
        where: { user_id: parseInt(id) },
        data: { role },
    });
};
export const deleteUser = async (id) => {
    return await prisma.user.delete({ where: { user_id: parseInt(id) } });
};
