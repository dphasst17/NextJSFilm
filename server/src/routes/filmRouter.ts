import express from "express";
import FilmController from "../controllers/filmController"
import Auth from "../controllers/authController";
const router = express.Router()
const FilmControllers = new FilmController();
const AuthControllers = new Auth()
router.get('/',FilmControllers.getAllFilm)
router.get('/detail/:id',FilmControllers.getFilmDetail)
router.get('/coming',FilmControllers.getComingFilm)
router.post('/',FilmControllers.createFilmData)
router.post('/search',FilmControllers.searchFilm)
router.post('/buy',AuthControllers.verify as any,FilmControllers.buyTicket as any)
router.patch('/ticket/confirm',FilmControllers.confirmTicket)
export default router