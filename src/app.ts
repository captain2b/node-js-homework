import loaders from "./loaders";
import express, {NextFunction, Request, Response} from "express";
import router from "./controllers/user.controller";

const startServer = () => {
    const app = express();

    loaders();

    app.use(express.json());

    const port = 3000;
    app.set('x-powered-by', false);

// Error handler should have 4 parameters
// eslint-disable-next-line no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log('Error: ', err);
        res.status(500).json(err);
    });

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
});

    app.use('/', router);

};

startServer();