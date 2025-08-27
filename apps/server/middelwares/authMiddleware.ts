import type { NextFunction, Request, Response } from "express"


export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    try {
        const headers = req.headers.authorization;

        const jwt = headers?.split(" ")[1];

        
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}