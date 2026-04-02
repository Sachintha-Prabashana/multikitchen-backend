import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import prisma from '../lib/prisma.js';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const performBackup = async (user_id) => {
    const fileName = `backup-${Date.now()}.sql`;
    const filePath = path.join(__dirname, '../../backups', fileName);
    const dbUrl = process.env.DATABASE_URL;
    const matches = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!matches)
        throw new Error('Invalid DATABASE_URL format');
    const [, user, password, host, port, database] = matches;
    const command = `mysqldump -h ${host} -P ${port} -u ${user} -p${password} ${database} > "${filePath}"`;
    return new Promise((resolve, reject) => {
        exec(command, async (error) => {
            if (error)
                return reject(new Error('Backup failed'));
            try {
                const backupLog = await prisma.backupLog.create({
                    data: { file_path: fileName, user_id },
                });
                resolve(backupLog);
            }
            catch (saveError) {
                reject(new Error('Failed to log backup'));
            }
        });
    });
};
export const getAllBackupLogs = async () => {
    return await prisma.backupLog.findMany({
        include: { user: { select: { name: true } } },
        orderBy: { date: 'desc' },
    });
};
export const performRestore = async (fileName) => {
    const filePath = path.join(__dirname, '../../backups', fileName);
    if (!fs.existsSync(filePath))
        throw new Error('Backup file not found');
    const dbUrl = process.env.DATABASE_URL;
    const matches = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!matches)
        throw new Error('Invalid DATABASE_URL format');
    const [, user, password, host, port, database] = matches;
    const command = `mysql -h ${host} -P ${port} -u ${user} -p${password} ${database} < "${filePath}"`;
    return new Promise((resolve, reject) => {
        exec(command, (error) => {
            if (error)
                return reject(new Error('Restore failed'));
            resolve({ message: 'Database restored successfully' });
        });
    });
};
