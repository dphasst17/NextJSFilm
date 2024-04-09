import { collectionFilm, collectionInfo, collectionTicket } from "./../models/collection";
import { Request, Response } from "express";
import * as NewResponse from "../utils/response";
import * as NewMessage from "../utils/message";
import { handleSendMail } from "../utils/mail";
import crypto from "crypto";
import { RequestCustom } from "./authController";
import { Server } from "socket.io";
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
  id: string;
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
interface TicketDetail {
  idTicket: string;
  name: string;
  phone: string;
  email: string;
  timeFrame: number;
  date: string;
  count: number;
  idFilm: string;
  orderId: string;
  isConfirm: boolean;
  idUser: string;
  dateBuy: string;
  seat: string;
  price:number
}
export default class Films /*  extends AbstractFilm */ {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
  private randomString = (length: number) => {
    return crypto.randomBytes(length).toString("hex");
  };
  public getAllFilm = (req: Request, res: Response) => {
    collectionFilm
      .find({})
      .project({ title: 1, thumbnails: 1, id: 1, time: 1, _id: 0 })
      .sort({ release: -1 })
      .toArray()
      .then((result) => NewResponse.responseData(res, 200, result))
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public getComingFilm = (req: Request, res: Response) => {
    collectionFilm
      .find({})
      .sort({ release: -1 })
      .limit(3)
      .toArray()
      .then((result) => NewResponse.responseData(res, 200, result))
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public getFilmDetail = (req: Request, res: Response) => {
    const detailId = req.params["id"];
    collectionFilm
      .find({ id: detailId.toUpperCase() }).project({_id:0}).toArray()
      .then((result) => NewResponse.responseData(res, 200, result))
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public searchFilm = (req: Request, res: Response) => {
    const data = req.body;
    collectionFilm
      .find({ title: new RegExp(data.value, "i") })
      .project({ title: 1, thumbnails: 1, id: 1, time: 1, _id: 0 })
      .toArray()
      .then((results) => {
        NewResponse.responseData(res, 200, results);
      })
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public createFilmData = async (req: Request, res: Response) => {
    const data = req.body;
    const resultData: Film = {
      id: data.id,
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
    collectionFilm
      .insertOne(resultData)
      .then((result) => {
        if (result.acknowledged && result.insertedId) {
          NewResponse.responseDataMessage(
            res,
            201,
            [{ _id: result.insertedId }],
            NewMessage.createItemsMessage("ticket")
          );
        } else {
          NewResponse.responseMessage(res, 422, "Create ticket is failure");
        }
      })
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public updateFilm = (req:Request,res:Response) => {
    const data = req.body;
    const resultData: Film = {
      id: data.id,
      title: data.title,
      director: data.director,
      cast: data.cast,
      des: data.des,
      release: data.release,
      time: data.time,
      background: data.background,
      thumbnails: data.thumbnails,
      trailer: data.trailer,
      frame: data.frame,
    };
    const update = {$set:resultData}
    const options = { returnOriginal: false, includeResultMetadata: false };
    collectionFilm.findOneAndUpdate({id:data.id},update,options)
    .then((result) => {
      if (!result) {
        NewResponse.responseMessage(res,401,"There was an error during execution, please try again later.");
        return;
      }
      NewResponse.responseMessage(res, 200, NewMessage.updateItemsMessage(`film ${data.title}`));
    })
    .catch((err) =>
      NewResponse.responseMessage(res,500,"A server error occurred. Please try again in 5 minutes.")
    );
  }
  public buyTicket = (req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    const data = req.body;
    const id = this.randomString(4);
    const getData: TicketDetail = {
      idTicket: `${data.idFilm}-${id}`,
      name: data.info.name,
      phone: data.info.phone,
      email: data.info.email,
      timeFrame: data.timeFrame,
      date: data.date,
      count: data.count,
      idFilm: data.idFilm,
      orderId: data.orderId,
      isConfirm: false,
      idUser: idUser,
      dateBuy: new Date().toLocaleDateString(),
      seat: data.seat,
      price:data.price ? data.price : 3
    };
    collectionTicket
      .insertOne(getData)
      .then((result) => {
        if (result.acknowledged && result.insertedId) {
          collectionFilm
            .find({ id: data.idFilm })
            .project({ title: 1, background: 1, _id: 0 })
            .toArray()
            .then((findData) => {
              const infoTicket = {
                toMail: data.info.email,
                subject: "FILM TICKET",
                title: findData[0].title,
                name: data.info.name,
                frame: data.timeFrame,
                date: data.date,
                count: data.count,
                id: `${data.idFilm}-${id}`,
                background: findData[0].background,
              };
              const seatData = {
                date:data.date,
                time:data.timeFrame,
                seat:data.seat
              }
              this.io.emit('seat-changed', seatData);
              handleSendMail(res, infoTicket, "qr");
            });
        } else {
          NewResponse.responseMessage(res, 422, "Create ticket is failure");
        }
      })
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public confirmTicket = (req: Request, res: Response) => {
    const data = req.body;
    const update = { $set: { isConfirm: true } };
    const options = { returnOriginal: false, includeResultMetadata: false };
    collectionTicket
      .findOneAndUpdate(
        { idTicket: data.id, isConfirm: false },
        update,
        options
      )
      .then((result) => {
        if (!result) {
          NewResponse.responseMessage(res, 401,"There was an error during execution, please try again later.");
          return;
        }
        const idUser = result.idUser
        const price = result.price
        const updatePoint = price === 3 ? {$inc:{point:1}} : {$set:{point:0}}
        collectionInfo.findOneAndUpdate({idUser:idUser},updatePoint,options)
        .then(iResult => {
          if(!iResult){
            NewResponse.responseMessage(res, 401,"There was an error during execution, please try again later.");
            return;
          }
          NewResponse.responseMessage(res, 200, "Confirm ticket is success");
        })
      })
      .catch((err) =>
        NewResponse.responseMessage(res,500,"A server error occurred. Please try again in 5 minutes.")
      );
  };
  public getSeatDetail = (req: Request, res: Response) => {
    const getDate: string = req.params["date"].split("-").reverse().join("/");
    const time: number = Number(req.params["time"]);
    collectionTicket
      .find({ date: getDate, timeFrame: time })
      .project({ seat: 1, _id: 0 })
      .toArray()
      .then((result) =>
        NewResponse.responseData(
          res,
          200,
          result.map((s) => s.seat)
        )
      );
  };
}
