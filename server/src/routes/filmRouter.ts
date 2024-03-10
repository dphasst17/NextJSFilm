import express from "express";
import FilmController from "../controllers/filmController"
const router = express.Router()
const FilmControllers = new FilmController();
router.get('/',FilmControllers.getAllFilm)
router.get('/detail/:id',FilmControllers.getFilmDetail)
router.post('/',FilmControllers.createFilmData)
export default router