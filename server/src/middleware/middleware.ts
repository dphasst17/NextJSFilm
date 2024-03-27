import { NextFunction,Response } from "express";
import { RequestCustom } from "../controllers/authController";
import jwt from "jsonwebtoken";
import { collectionAuth } from "../models/collection";
import * as NewResponse from "../utils/response";
import * as NewMessage from "../utils/message";
export default class MiddleWare {
    public verify = (req:RequestCustom,res:Response,next:NextFunction) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {return res.sendStatus(401)};
        const token = authHeader?.split(" ")[1];
        if(token){
            jwt.verify(token, process.env.SECRET_KEY as string, (err:any, data:any) => {
                if (err) res.sendStatus(403);
                req.idUser = data.id;
                next();
            });
        }else{
            res.sendStatus(403)
        }
    }
    public verifyAdmin = async(req:RequestCustom,res:Response,next:NextFunction) => {
        const idUser = req.idUser;
        const result = await collectionAuth.find({idUser}).project({_id:0,role:1,idUser:1}).toArray()
        if(result.length === 0){
            return NewResponse.responseMessage(res,403,"User doesn't exit")
        }
        const getRole:number = Number(result.flatMap(u => u.role))
        if(getRole === 2){
            return NewResponse.responseMessage(res,403,"You do not have sufficient permissions to access this resource")
        }
        next()
    }
    public isAdmin = async(req:RequestCustom,res:Response,next:NextFunction) => {
        const idUser = req.idUser
        const result = await collectionAuth.find({idUser}).project({_id:0,role:1,idUser:1}).toArray()
        if(result.length === 0){
            return NewResponse.responseMessage(res,403,"User doesn't exit")
        }
        const getRole:number = Number(result.flatMap(u => u.role))
        if(getRole !== 0){
            return NewResponse.responseMessage(res,403,"You do not have sufficient permissions to access this resource")
        }
        next()
    }
}