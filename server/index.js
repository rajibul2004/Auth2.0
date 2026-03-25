import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import path from 'path'
const app = express();
dotenv.config()

import connectDB from './config/mongodb.js'

import authRotes from './routes/authRoutes.js'

const PORT = process.env.PORT || 5000;
const host = process.env.HOST
const allowedOrigin = [process.env.CLIENT_URI,"http://localhost:5173"]

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

const dir_name=path.resolve();
const env=process.env.NODE_ENV
if(env==="production"){
    app.use(express.static(path.join(dir_name,'../client/dist')));
    app.get(/.*/,(req,res)=>{
        res.sendFile(path.join(dir_name,  "../client/dist/index.html"));
    })
}

app.listen(PORT, () => {
    console.log(`App is listening at http://${host}:${PORT}/`)
})