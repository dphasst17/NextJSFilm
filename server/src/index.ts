import express from "express";
import dotenv from "dotenv";
import * as db from "./models/connect"
import FilmRouter from "./routes/filmRouter"
import AuthRouter from "./routes/authRouter"
import UserRouter from "./routes/userRouter"
import StatisticalRouter from "./routes/statisticalRouter"
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"]
  }
});
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
    );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization");
    next();
});

db.connectDB()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

const arrRoute = [
  {path:'film',isApi:true,routes:FilmRouter(io)},
  {path:'auth',isApi:false,routes:AuthRouter},
  {path:'user',isApi:false,routes:UserRouter},
  {path:'statistical',isApi:false,routes:StatisticalRouter}
]
arrRoute.map(r => app.use((r.isApi === true ? `/api/${r.path}`: `/${r.path}`),r.routes))
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

