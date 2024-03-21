import { Request, Response } from "express";
import { client } from "../models/connect";
import * as NewResponse from "../utils/response";
import * as NewMessage from "../utils/message";
import { handleSendMail } from "../utils/mail";
import crypto from "crypto"
import { RequestCustom } from "./authController";
/* abstract class AbstractFilm  {
  abstract getAllFilm(req: Request, res: Response):void;
  abstract getComingFilm(req: Request, res: Response):void;
  abstract getFilmDetail(req: Request, res: Response):void;
  abstract searchFilm(req: Request, res: Response):void;
  abstract createFilmData(req: Request, res: Response):void;
  abstract buyTicket(req: Request, res: Response):void;
  abstract confirmTicket(req: Request, res: Response):void;
} */
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
  idTicket:string,
  name:string;
  phone:string;
  email:string;
  timeFrame:number;
  date:string;
  count:number;
  idFilm:string;
  orderId:string;
  isConfirm:boolean;
  idUser:string
}
const database = client.db("FilmDB");
const collection = database.collection("film");
const collectionTicket = database.collection("ticket")
export default class FilmController/*  extends AbstractFilm */{
  private randomString = (length:number) => {
    return crypto.randomBytes(length).toString('hex');
  }
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
  public buyTicket = (req:RequestCustom,res:Response) => {
    const idUser = req.idUser;
    const data = req.body;
    const id = this.randomString(4)
    const getData:TicketDetail = {
      idTicket:`${data.idFilm}-${id}`,
      name:data.info.name,
      phone:data.info.phone,
      email:data.info.email,
      timeFrame:data.timeFrame,
      date:data.date,
      count:data.count,
      idFilm:data.idFilm,
      orderId:data.orderId,
      isConfirm:false,
      idUser:idUser
    }
    collectionTicket.insertOne(getData)
    .then(result => {
      if(result.acknowledged && result.insertedId){
        collection.find({id: data.idFilm}).project({title:1,background:1,_id:0}).toArray()
        .then(findData => {
          const infoTicket = {
            toMail:data.info.email,
            subject:'FILM TICKET',
            title:findData[0].title,
            name:data.info.name,
            frame:data.timeFrame,
            date:data.date,
            count:data.count,
            id:`${data.idFilm}-${id}`,
            background:findData[0].background
          }
          handleSendMail(res,infoTicket,'qr')
        })
      }else{
        NewResponse.responseMessage(res, 422, "Create ticket is failure");
      }
    })
    .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
  }
  public confirmTicket = (req:Request,res:Response) => {
    const data = req.body
    const update = {$set: {isConfirm:true}};
    const options = { returnOriginal: false, includeResultMetadata: false };
    collectionTicket.findOneAndUpdate({idTicket:data.id,isConfirm:false},update,options)
    .then(result => {
      if(!result){
        NewResponse.responseMessage(res,401,'There was an error during execution, please try again later.')
        return
      }
      NewResponse.responseMessage(res,200,'Confirm ticket is success')
    })
    .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
  }
}
