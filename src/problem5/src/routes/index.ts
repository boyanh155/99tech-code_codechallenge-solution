import { Application, Response, Request } from "express";
import routerResource from "./resource"

export const router = (app: Application) => {


    app.use('/resources', routerResource)
    app.use('*', ( req: Request,res: Response,) => {
        res.send('Welcome to 99 API. Go to /resource for staring.')
    })
}


