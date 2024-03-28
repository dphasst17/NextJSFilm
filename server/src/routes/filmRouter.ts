import express from "express";
import { Server } from "socket.io";
import MiddleWare from "../middleware/middleware";
import Films from "../controllers/filmController";
const router = express.Router();
export default (io: Server) => {
  const FilmControllers = new Films(io);
  const Middle = new MiddleWare()
  router.get("/", FilmControllers.getAllFilm);
  router.get("/detail/:id", FilmControllers.getFilmDetail);
  router.get("/coming", FilmControllers.getComingFilm);
  router.post("/",Middle.verify as any,Middle.verifyAdmin as any,FilmControllers.createFilmData);
  router.put("/",FilmControllers.updateFilm)
  router.post("/search", FilmControllers.searchFilm);
  router.post("/buy",Middle.verify as any,FilmControllers.buyTicket as any);
  router.patch("/ticket/confirm", FilmControllers.confirmTicket);
  router.get("/seat/:date/:time", FilmControllers.getSeatDetail);
  return router;
};
