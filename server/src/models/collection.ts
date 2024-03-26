import { client } from "./connect";

const database = client.db("FilmDB");
export const collectionAuth = database.collection("auth");
export const collectionInfo = database.collection("info");
export const collectionFilm = database.collection("film");
export const collectionTicket = database.collection("ticket");