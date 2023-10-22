import { Response } from "express";


export default {

    fulfill: (res: Response, data: any, message: string): void => {
        res.status(200).send({
            message: message || "Success",
            data: data || {}
        })
    },
    reject: (res: Response, message: string, statusCode: number | undefined): void => {
        res.status(statusCode || 500).send({
            message: message || 'Failed',
        })
    }

}