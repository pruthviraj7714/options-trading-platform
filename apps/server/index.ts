import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRouter';
import candleRouter from './routes/candleRouter';

const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter);
app.use('/api/candles', candleRouter);


app.listen(3000, () => {
    console.log('server is running on port 3000');
})