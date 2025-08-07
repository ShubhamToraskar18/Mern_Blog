// index.js = Entry Point
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})


import express from 'express';
const app = express();

import connectionDB from './db/databaseConnection.js';
connectionDB()
.then(() => {
    app.listen(process.env.PORT,() => {
    console.log("Sever running on port",process.env.PORT);
    });
})
.catch((error) => {
    console.log("Server connection failed:",error)
});


