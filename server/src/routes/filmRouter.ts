import express from "express";
import FilmController from "../controllers/filmController"
const router = express.Router()
const FilmControllers = new FilmController();
router.get('/',FilmControllers.getAllFilm)
router.get('/detail/:id',FilmControllers.getFilmDetail)
router.get('/coming',FilmControllers.getComingFilm)
router.post('/',FilmControllers.createFilmData)
router.post('/search',FilmControllers.searchFilm)
router.post('/buy',FilmControllers.buyTicket)
export default router