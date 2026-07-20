import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';
const app = express();
app.set('trust proxy', 1);
dotenv.config()

import connectDB from './config/mongodb.js'

import authRotes from './routes/authRoutes.js'

const PORT = process.env.PORT || 5000;
const host = process.env.HOST
// const allowedOrigin = [process.env.CLIENT_URI,"http://localhost:5173"]
const allowedOrigin = ["http://localhost:5173"]

app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: allowedOrigin,
    credentials: true
  }));
}
connectDB()


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use('/api/auth',authRotes)



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env=process.env.NODE_ENV
if(env==="production"){
    app.use(express.static(path.join(__dirname,'../client/dist')));
    app.get(/.*/,(req,res)=>{
        res.sendFile(path.join(__dirname,  "../client/dist/index.html"));
    })
}

app.listen(PORT, () => {
    console.log(`App is listening at http://${host}:${PORT}/`)
})