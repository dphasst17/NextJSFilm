import { Request, Response } from "express";
import { client } from "../models/connect";
import * as NewResponse from "../utils/response";
import * as NewMessage from "../utils/message";
interface Film {
  id:string;
  title: string;
  director: string;
  cast: string;
  des: string;
  release: string;
  time: string;
  background: string;
  thumbnails: string;
  trailer: string;
  frame: Array<number>;
}
interface TicketDetail{
  name:string;
  phone:string;
  email:string;
  timeFrame:number;
  date:string;
  count:number;
  idFilm:string;
  orderId:string
}
const database = client.db("FilmDB");
const collection = database.collection("film");
const collectionTicket = database.collection("ticket")
export default class FilmController{

  public getAllFilm = (req: Request, res: Response) => {
    collection
      .find({})
      .project({ title: 1, thumbnails: 1, id: 1, time: 1 ,_id:0})
      .sort({release:-1})
      .toArray()
      .then(result => NewResponse.responseData(res, 200, result))
      .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'));
    ;
  };
  public getComingFilm = (req: Request, res: Response) => {
    collection.find({}).sort({release:-1}).limit(3).toArray().then(result => NewResponse.responseData(res, 200, result))
    .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'));
  }
  public getFilmDetail = (req: Request, res: Response) => {
    const detailId = req.params["id"];
    collection.findOne({ id: detailId.toUpperCase() })
    .then(result => NewResponse.responseData(res, 200, [result]))
    .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
    
  };
  public searchFilm = (req:Request,res:Response) => {
    const data = req.body
    collection.find({title: new RegExp(data.value, 'i')})
    .project({ title: 1, thumbnails: 1, id: 1, time: 1 ,_id:0})
    .toArray()
    .then(results => {
      NewResponse.responseData(res,200,results)
    })
    .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
  }
  public createFilmData = async (req: Request, res: Response) => {
    const data = req.body;
    const resultData: Film = {
      id:data.id,
      title: data.title,
      director: data.director,
      cast: data.cast,
      des: data.description,
      release: data.release,
      time: data.time,
      background: data.background,
      thumbnails: data.thumbnails,
      trailer: data.trailer,
      frame: data.frame,
    };
    collection.insertOne(resultData)
    .then(result => {
      if(result.acknowledged && result.insertedId){
        NewResponse.responseDataMessage(
          res,
          201,
          [{ _id:result.insertedId }],
          NewMessage.createItemsMessage("ticket")
        );
      }else{
        NewResponse.responseMessage(res, 422, "Create ticket is failure");
      }
    })
    .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
  };
  public buyTicket = (req:Request,res:Response) => {
    const data = req.body;
    const getData:TicketDetail = {
      name:data.info.name,
      phone:data.info.phone,
      email:data.info.email,
      timeFrame:data.timeFrame,
      date:data.date,
      count:data.info.count,
      idFilm:data.idFilm,
      orderId:data.orderId
    }
    collectionTicket.insertOne(getData)
    .then(result => {
      if(result.acknowledged && result.insertedId){
        NewResponse.responseDataMessage(
          res,
          201,
          [{ _id:result.insertedId }],
          "Buy ticket is success"
        );
      }else{
        NewResponse.responseMessage(res, 422, "Create ticket is failure");
      }
    })
    .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
  }
}
