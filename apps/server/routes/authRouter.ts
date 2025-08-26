import { Router } from "express";
import { SignupSchema } from '@repo/common';
import prisma from "@repo/db"


const authRouter = Router();


authRouter.post('/signin', async (req, res) => {
    try {
        const { error, data } = SignupSchema.safeParse(req.body); 

        if(error) {
            res.status(400).json({
                message : "Invalid Format",
                error : error.message
            });
            return;
        }

        const { username, password } = data;


        const user = await prisma.user.create({
            data : {
                username,
                password
            }
        })

        

    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error"
        })
    }


})


export default authRouter;