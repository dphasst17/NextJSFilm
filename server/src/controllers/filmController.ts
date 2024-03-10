import { Request, Response } from "express";
import { client } from "../models/connect";
import { ObjectId } from "mongodb";
import * as NewResponse from "../utils/response";
import * as NewMessage from "../utils/message";
interface Film {
  title: String;
  director: String;
  cast: String;
  des: String;
  release: String;
  time: String;
  background: String;
  thumbnails: String;
  trailer: String;
  ticket: Number;
}
interface TicketInfo {
  timeFrame: any[];
  date: any[];
}
interface TicketDetail{
  email:String,
  dateBuy:String,
  _id:ObjectId
}
const database = client.db("FilmDB");
const collection = database.collection("film");

export default class FilmController {
  public getAllFilm = async (req: Request, res: Response) => {
    const result = await collection
      .find({})
      .project({ title: 1, thumbnails: 1, id: 1, time: 1 ,_id:0})
      .toArray();
    NewResponse.responseData(res, 200, result);
  };
  public getFilmDetail = async (req: Request, res: Response) => {
    const detailId = req.params["id"];
    
    const result = await collection.findOne({ id: detailId.toUpperCase() });
    NewResponse.responseData(res, 200, result);
  };
  public createFilmData = async (req: Request, res: Response) => {
    const data = req.body;
    const resultData: Film = {
      title: data.title,
      director: data.director,
      cast: data.cast,
      des: data.description,
      release: data.release,
      time: data.time,
      background: data.background,
      thumbnails: data.thumb,
      trailer: data.trailer,
      ticket: data.ticket,
    };
    const result = collection.insertOne(resultData);
    if ((await result).acknowledged && (await result).insertedId) {
      NewResponse.responseDataMessage(
        res,
        201,
        [{ _id: (await result).insertedId }],
        NewMessage.createItemsMessage("ticket")
      );
    } else {
      NewResponse.responseMessage(res, 422, "Create ticket is failure");
    }
  };
}
