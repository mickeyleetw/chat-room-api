import express from 'express';
import { userRouter } from './apps';

const API_PORT = process.env.API_PORT || 3000;

const app = express();

app.use(userRouter);

app.listen(API_PORT, () => console.log(`This server is running on port ${API_PORT}`));

export default app;
