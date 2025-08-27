import { Router } from "express";
import { authMiddleware } from "../middelwares/authMiddleware";

const accountRouter = Router();

accountRouter.post('/deposit', authMiddleware, (req, res) => {
    const { amount } = req.body;



})


export default accountRouter;