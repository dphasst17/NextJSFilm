import { collectionAuth, collectionInfo } from './../models/collection';
import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";
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
export interface RequestCustom extends Request{
    idUser:string
}
export default class Auth {
    private createToken = (idUser:string) => {
        const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY as string, { expiresIn: "600s", });
        const refreshToken = jwt.sign({ id: `${idUser}-token` }, process.env.SECRET_KEY as string, { expiresIn: "5d" });
        const { exp: expAccess } = jwt.decode(accessToken) as JwtPayloadCustom;
        const { exp: expRefresh } = jwt.decode(refreshToken) as JwtPayloadCustom;
        return { accessToken, refreshToken, expAccess, expRefresh }
    }
    private createAToken = (idUser:string) => {
        const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY as string, { expiresIn: "600s", });
        const { exp: expAccess } = jwt.decode(accessToken) as JwtPayloadCustom;
        return {accessToken,expAccess}
    }
    //hash_pass
    private encodePass = (password:string) => {
        const saltRound = process.env.SALT as string
        const salt = bcrypt.genSaltSync(Number(saltRound));
        return bcrypt.hashSync(password, salt);
    }
    public login = (req:Request,res:Response) => {
        const data = req.body;
        const resultData:AuthReq = {
            username:data.username,
            password:data.password
        }
        collectionAuth.find({username:resultData.username}).toArray()
        .then(results => {
            if(results.length === 0){
                NewResponse.responseMessage(res,401,"Username doesn't exit")
                return
            }
            const pass_hash = results.map(e => e.password).toString()
            const isPassword = bcrypt.compareSync(resultData.password, pass_hash);
            if (!isPassword) {
                NewResponse.responseMessage(res,401,"Incorrect password")
                return
            }
            const idUser = results.map(e => e.idUser).toString()
            const token = this.createToken(idUser)
            return NewResponse.responseData(res,200,{...token,role:results.map(e => e.role)[0]})
        })
        .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
    }
    public register = async(req:Request,res:Response) => {
        const data = req.body
        const pass_hash = this.encodePass(data.password)
        try{
            const [auth,info] = await Promise.all([
                collectionAuth.find({username:data.username}).toArray(),
                collectionInfo.find({email:data.email}).toArray()
            ])
            if(auth.length !== 0 ){
                NewResponse.responseMessage(res,401,'Username is already taken')
                return
            }
            if(info.length !== 0){
                NewResponse.responseMessage(res,401,'Email is already taken')
                return
            }
            await collectionAuth.insertOne({idUser:data.username,username:data.username,password:pass_hash,role:data.role ? data.role : 2})
            collectionInfo.insertOne({
                idUser:data.username,
                email:data.email,
                name:data.name ? data.name:"",
                phone:data.phone ? data.phone:"",
                point:0,
                action:"active",
                dateCreated:new Date().toISOString().split('T')[0]
            })
            .then(infoRes => NewResponse.responseMessage(res,201,NewMessage.createItemsMessage('account')))
        }
        catch(error){
            NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.')
        }
    }
    public createNewToken = (req:RequestCustom,res:Response) => {
        const idUser = req.idUser
        collectionAuth.find({idUser:idUser.split('-')[0]}).toArray()
        .then(authRes => {
            if(authRes.length === 0){
                NewResponse.responseMessage(res,401,"User doesn't exit")
                return
            }
            const token = this.createAToken(idUser.split('-')[0])
            NewResponse.responseData(res,200,token)
        })
    }
    public updatePassword = async(req:RequestCustom,res:Response) => {
        const idUser = req.idUser
        const data = req.body;
        const getPass = await collectionAuth.find({idUser:idUser}).project({password:1,id:1,_id:0}).toArray()
        const password = getPass.map(p => p.password).toString()
        const isPassword = bcrypt.compareSync(data.current, password)
        if(!isPassword){
            return NewResponse.responseMessage(res,401,"Incorrect password")
        }
        const newPassword = this.encodePass(data.new)
        const update = {$set:{password:newPassword}}
        const options = { returnOriginal: false, includeResultMetadata: false };
        collectionAuth.findOneAndUpdate({idUser:idUser},update,options)
        .then(result => {
            if(!result){
                return NewResponse.responseMessage(res,401,'')
            }
            NewResponse.responseMessage(res,200,NewMessage.updateItemsMessage('password'))
        })
        .catch(err => NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.'))
    }
}