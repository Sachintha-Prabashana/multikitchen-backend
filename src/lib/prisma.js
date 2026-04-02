import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// Custom path එකෙන් Prisma Client එක import කරනවා
import pkg from '@prisma/client';
import 'dotenv/config';

const { PrismaClient } = pkg;

// Heroku DATABASE_URL එකට SSL mode එක නැත්නම් ඒක add කරගන්නවා
let connectionString = process.env.DATABASE_URL;

if (connectionString && !connectionString.includes('sslmode')) {
    connectionString += (connectionString.includes('?') ? '&' : '?') + 'sslmode=no-verify';
}

// Heroku Postgres connection එක SSL නැතිව reject කරන නිසා, 
// ssl object එක rejectUnauthorized: false විදියට දාන්න ඕනේ.
const pool = new Pool({ 
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;