import { Response } from "express";
import { RequestCustom } from "./authController";
import { client } from "../models/connect";
import * as NewResponse from "../utils/response";
import * as NewMessage from "../utils/message";
const database = client.db("FilmDB");
const collection = database.collection("info")
export default class User {
    public getAll = (req:RequestCustom,res:Response) => {
        const idUser = req.idUser
        collection.find({idUser:idUser}).toArray()
        .then(infoRes => NewResponse.responseData(res,200,infoRes))
        .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
    }
}