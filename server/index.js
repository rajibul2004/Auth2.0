import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config()

import connectDB from './config/mongodb.js'

import authRotes from './routes/authRoutes.js'

const PORT = process.env.PORT || 5000;
const host = process.env.HOST
const allowedOrigin = [process.env.CLIENT_URI,"http://localhost:5173"]

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigin
    , credentials: true
}))
connectDB()

app.get("/", (req, res) => {
    res.send("Server is running...")
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use('/api/auth',authRotes)


app.listen(PORT, () => {
    console.log(`App is listening at http://${host}:${PORT}/`)
})