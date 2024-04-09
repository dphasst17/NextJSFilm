import { Request, Response } from "express";
import { collectionInfo, collectionTicket } from "../models/collection";
import * as NewResponse from "../utils/response";

export default class Statistical {
  private getMonth = new Date().getMonth();
  private currentMonth = this.getMonth + 1 === 12 ? 1 : this.getMonth + 1;
  public user = (req: Request, res: Response) => {
    collectionInfo
      .aggregate([
        {
          $lookup: {
            from: "auth",
            localField: "idUser",
            foreignField: "idUser",
            as: "dataAuth",
          },
        },
        {
          $project: {
            _id: 0,
            idUser: 1,
            action: 1,
            dateCreated: 1,
            role: { $arrayElemAt: ["$dataAuth.role", 0] },
          },
        },
      ])
      .sort({ dateCreated: -1 })
      .toArray()
      .then((result) => {
        const totalUser = result.length;
        const newUser = result.map(
          (e) => Number(e.dateCreated.split("-")[1]) === this.currentMonth
        ).length;
        const activeUser = result.map((e) => e.action === "active").length;
        NewResponse.responseData(res, 200, {
          total: totalUser,
          new: newUser,
          active: activeUser,
          dataUser: result,
        });
      })
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public ticketRevenue = (req: Request, res: Response) => {
    collectionTicket
      .find()
      .project({ _id: 0, price: 1, dateBuy: 1 })
      .toArray()
      .then((result) => {
        const ticketSold: number = Number(result.length);
        const revenue: number = Number(
          result.map((p) => p.price).reduce((a, b) => a + b)
        );
        const getDataCurrentMonth = result.filter(
          (f) => Number(f.dateBuy.split("/")[1]) === this.currentMonth
        );
        const revenueCurrentMonth =
          getDataCurrentMonth.length !== 0
            ? getDataCurrentMonth.map((t) => t.price).reduce((a, b) => a + b)
            : 0;
        const getDataLastMonth = result.filter(
          (f) => Number(f.dateBuy.split("/")[1]) === this.currentMonth - 1
        );
        const revenueLastMonth =
          getDataLastMonth.length !== 0
            ? getDataLastMonth.map((t) => t.price).reduce((a, b) => a + b)
            : 0;
        NewResponse.responseData(res, 200, {
          ticketSold: ticketSold,
          totalRevenue: revenue,
          rcm: revenueCurrentMonth,
          rlm: revenueLastMonth,
        });
      })
      .catch((err) => {
        console.log(err);
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        );
      });
  };
  public popular = (req: Request, res: Response) => {
    collectionTicket
      .aggregate([
        { $group: { _id: "$idFilm", countTicket: { $sum: 1 } } },
        {
          $lookup: {
            from: "film",
            localField: "_id",
            foreignField: "id",
            as: "filmData",
          },
        },
        {
          $project: {
            _id: 0,
            idFilm: "$_id",
            countTicket: 1,
            title: { $arrayElemAt: ["$filmData.title", 0] },
            director: { $arrayElemAt: ["$filmData.director", 0] },
            thumbnails: { $arrayElemAt: ["$filmData.thumbnails", 0] },
            background: { $arrayElemAt: ["$filmData.background", 0] },
          },
        },
      ])
      .sort({ countTicket: -1 })
      .limit(1)
      .toArray()
      .then((result) => NewResponse.responseData(res, 200, result));
  };
}
