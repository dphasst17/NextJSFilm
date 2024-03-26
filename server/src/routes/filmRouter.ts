import express from "express";
import FilmController from "../controllers/filmController";
import Auth from "../controllers/authController";
import { Server } from "socket.io";
const router = express.Router();
export default (io: Server) => {
  const FilmControllers = new FilmController(io);
  const AuthControllers = new Auth();
  router.get("/", FilmControllers.getAllFilm);
  router.get("/detail/:id", FilmControllers.getFilmDetail);
  router.get("/coming", FilmControllers.getComingFilm);
  router.post("/", FilmControllers.createFilmData);
  router.put("/",FilmControllers.updateFilm)
  router.post("/search", FilmControllers.searchFilm);
  router.post("/buy",AuthControllers.verify as any,FilmControllers.buyTicket as any);
  router.patch("/ticket/confirm", FilmControllers.confirmTicket);
  router.get("/seat/:date/:time", FilmControllers.getSeatDetail);
  return router;
};
