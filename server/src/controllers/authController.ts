import { Request,Response } from "express";
interface AuthReq {
    username:String,
    password:String,
}
interface AuthRes {
    token:String,
    expired:Number
}