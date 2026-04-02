import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
import 'dotenv/config';

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;

// Heroku Postgres connection eka SSL nathiwa reject karana nisa, 
// ssl object eka rejectUnauthorized: false widiyata danna ona.
const pool = new Pool({ 
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;