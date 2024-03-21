import express from "express";
import dotenv from "dotenv";
import * as db from "./models/connect"
import FilmRouter from "./routes/filmRouter"
import AuthRouter from "./routes/authRouter"
import UserRouter from "./routes/userRouter"
import { handleSendMail, uiTicket } from "./utils/mail";
dotenv.config();
const app = express();
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
/* app.get('/test',(req,res) => {
  const data = {
    toMail:'phathuu12@gmail.com',
    subject:'FILM TICKET',
    id:'JJK2',//idFilm
    title:'JUJUTSU KAISEN SEASON 2',//title film
    name:'Phat',//nameUser
    date:'17/05/2024',
    frame:7,
    count:1
  }
  handleSendMail(res,data,'qr')
}) */
const arrRoute = [
  {path:'film',isApi:true,routes:FilmRouter},
  {path:'auth',isApi:false,routes:AuthRouter},
  {path:'user',isApi:false,routes:UserRouter}
]
arrRoute.map(r => app.use((r.isApi === true ? `/api/${r.path}`: `/${r.path}`),r.routes))
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

