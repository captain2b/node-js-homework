import express from 'express';
import loaders from './loaders';
import rootRouter from './controllers';
import errorHandler from "./middleware/errorHandler";

const startServer = () => {
    const app = express();

    loaders();

    app.use(express.json());

    const port = 3000;
    app.set('x-powered-by', false);

    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });

    app.use('/', rootRouter);
};

startServer();
