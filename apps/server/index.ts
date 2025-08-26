import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRouter';

const app = express();

app.use(express.json())
app.use(cors())

app.use('/auth', authRouter);


app.listen(3000, () => {
    console.log('server is running on port 3000');
})