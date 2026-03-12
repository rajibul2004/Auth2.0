import express from 'express'
import dotenv from 'dotenv'
const app = express();
dotenv.config()

const PORT = process.env.PORT || 5000;
const host = process.env.HOST

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running")
});


app.listen(PORT, () => {
    console.log(`App is listening at http://${host}:${PORT}/`)
})