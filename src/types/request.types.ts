import { Request } from "express"


export type RequestWithId<P> = Request<P,{},{},{}>

export type RequestWithBody<B> = Request<{},{},B,{}>

export type RequestWithBodyAndParam<P,B> = Request<P,{},B,{}>
