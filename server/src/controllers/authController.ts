import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";
import { client } from "../models/connect";
import * as NewResponse from "../utils/response";
import * as NewMessage from "../utils/message";
import bcrypt from 'bcrypt';
interface AuthReq {
    username:string,
    password:string
}
interface JwtPayloadCustom extends jwt.JwtPayload  {
    exp:number
}
interface RequestCustom extends Request{
    idUser:string
}
const database = client.db("FilmDB");
const collection = database.collection("auth");
export default class Auth {
    private createToken = (idUser:string) => {
        const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY as string, { expiresIn: "600s", });
        const refreshToken = jwt.sign({ id: `${idUser}-token` }, process.env.SECRET_KEY as string, { expiresIn: "5d" });
        const { exp: expAccess } = jwt.decode(accessToken) as JwtPayloadCustom;
        const { exp: expRefresh } = jwt.decode(refreshToken) as JwtPayloadCustom;
        return { accessToken, refreshToken, expAccess, expRefresh }
    }
    //hash_pass
    private encodePass = (password:string) => {
        const saltRound = process.env.SALT as string
        const salt = bcrypt.genSaltSync(Number(saltRound));
        return bcrypt.hashSync(password, salt);
    }
    public verify(req:RequestCustom,res:Response,next:NextFunction){
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
    public login = (req:Request,res:Response) => {
        const data = req.body;
        collection.find({username:data.username}).toArray()
        .then(results => {
            if(results.length === 0){
                NewResponse.responseMessage(res,401,"Username doesn't exit")
                return
            }
            const pass_hash = results.map(e => e.password).toString()
            const isPassword = bcrypt.compareSync(data.password, pass_hash);
            if (!isPassword) {
                NewResponse.responseMessage(res,401,"Incorrect password")
                return
            }
            const idUser = results.map(e => e.idUser).toString()
            const token = this.createToken(idUser)
            NewResponse.responseData(res,200,{...token,role:results.map(e => e.role)[0]})
        })
        .catch(err => {
            console.log(err)
            NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.')
        })
    }
    public register = (req:Request,res:Response) => {
        const data = req.body
        const pass_hash = this.encodePass(data.password)
        collection.find({username:data.username}).toArray()
        .then(resFind => {
            if(resFind.length !== 0){
                NewResponse.responseMessage(res,401,'Username is already taken')
                return
            }
            collection.insertOne({idUser:data.username,username:data.username,password:pass_hash,role:data.role ? data.role : 2})
            .then(results => {
                NewResponse.responseMessage(res,201,NewMessage.createItemsMessage('account'))
            })
        })
        .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
    }

    public createNewToken = (req:RequestCustom,res:Response) => {
        const idUser = req.idUser
    }
}