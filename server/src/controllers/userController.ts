import { collectionInfo, collectionTicket, collectionFilm } from './../models/collection';
import { Request,Response } from "express";
import { RequestCustom } from "./authController";
import * as NewResponse from "../utils/response";
import * as NewMessage from "../utils/message";
export default class User {
  public getAll = async(req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    try{
        const [userData,ticketData] = await Promise.all([
            collectionInfo.find({ idUser: idUser }).toArray(),
            collectionTicket.aggregate([
                { $match: { idUser: idUser } },
                {
                    $lookup: {
                        from: 'film',
                        localField: 'idFilm',
                        foreignField: 'id',
                        as: 'filmData'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        idTicket: 1,
                        timeFrame: 1,
                        date: 1,
                        idFilm: 1,
                        count: 1,
                        dateBuy:1,
                        title:{ $arrayElemAt: ['$filmData.title', 0] },
                        thumbnails: { $arrayElemAt: ['$filmData.thumbnails', 0] },
                        background: { $arrayElemAt: ['$filmData.background', 0] }
                    }
                }
            ]).sort({dateBuy:-1}).toArray()
        ])
        if(userData.length === 0){
            return NewResponse.responseMessage(res,401,"User doesn't exit")
        }
        const result = [{...userData[0],ticket:ticketData.length !== 0 ? ticketData : []}]
        NewResponse.responseData(res, 200, result)
    }
    catch{(err:any) => NewResponse.responseMessage(res,500,"A server error occurred. Please try again in 5 minutes.")}
  };
  public updateUser = (req: Request, res: Response) => {
    const reqCustom = req as RequestCustom
    const idUser = reqCustom.idUser;
    const data = req.body;
    const update = { $set: {name:data.name,phone:data.phone,email:data.email} };
    const options = { returnOriginal: false, includeResultMetadata: false };
    collectionInfo
      .findOneAndUpdate({ idUser: idUser }, update, options)
      .then((result) => {
        if (!result) {
          NewResponse.responseMessage(res, 401, "There was an error during execution, please try again later.");
          return;
        }
        NewResponse.responseMessage(res, 200, NewMessage.updateItemsMessage("user info"));
      })
      .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
  };
}
