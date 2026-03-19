import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config()

import connectDB from './config/mongodb.js'

import authRotes from './routes/authRoutes.js'
const PORT = process.env.PORT || 5000;
const host = process.env.HOST

app.use(express.json());
app.use(cookieParser());
connectDB()

app.get("/", (req, res) => {
    res.send("Server is running...")
});

app.use('/api/auth',authRotes)


app.listen(PORT, () => {
    console.log(`App is listening at http://${host}:${PORT}/`)
})