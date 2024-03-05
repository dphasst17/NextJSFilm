import express from "express";
import dotenv from "dotenv";
import * as db from "./db/connect.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization");
    next();
});

db.connectDB()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});