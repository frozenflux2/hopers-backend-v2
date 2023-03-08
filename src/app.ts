import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import routes from './routes/v1';
import cors from 'cors';
import mainLogic from './logic';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(morgan('tiny'));

// fetch logic
app.use((_req: Request, _res: Response, next: NextFunction) => {
    mainLogic();
    next();
});

// v1 api routes
app.use('/', routes);

app.use((err, _req, res, _next) => {
    res.status(500);
    res.json({ error: err.message });
});

export default app;
