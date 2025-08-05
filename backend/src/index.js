// index.js = Entry Point
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})

import connectionDB from './db/databaseConnection.js';

connectionDB();
