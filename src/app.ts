import express from 'express';
import { Router } from 'express';
import { userRouter,chatRoomRouter } from './apps';

const API_PORT = process.env.API_PORT || 3000;

const app = express();
app.use(express.json());

const rootRouter = Router();
rootRouter.get('/root', (req, res) => { res.status(200).send('Hello World'); });

app.use(userRouter);
app.use(chatRoomRouter);
app.use(rootRouter);

app.listen(API_PORT, () => console.log(`This server is running on port ${API_PORT}`));

export default app;
