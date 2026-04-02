import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
export const registerUser = async (name, email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: { name, email, password: hashedPassword, role: role || 'ADMIN' },
    });
};
export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw new Error('Invalid credentials');
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return {
        accessToken,
        refreshToken,
        user: { id: user.user_id, name: user.name, email: user.email, role: user.role }
    };
};
export const updateUserProfile = async (userId, data) => {
    const updateData = { ...data };
    if (data.password && data.password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(data.password, salt);
    }
    else {
        delete updateData.password;
    }
    return await prisma.user.update({
        where: { user_id: parseInt(userId) },
        data: updateData,
    });
};
