import express from 'express';
import loaders from './loaders';
import rootRouter from './controllers';
import errorHandler from './middleware/errorHandler';
import logger from './middleware/logger';
import winstonLogger from './middleware/winstonLogger';
import authenticateToken from "./middleware/auth";

const startServer = () => {
    process
        .on('unhandledRejection', (reason, promise) => {
            winstonLogger.log({
                level: 'error',
                message: `Unhandled Rejection at Promise: ${promise}. Reason: ${reason}`
            });
        })
        .on('uncaughtException', (err, origin) => {
            winstonLogger.log({
                level: 'error',
                message: `Caught exception: ${err}. Exception origin: ${origin}`
            });
            process.exit(1);
        });
    const app = express();

    loaders();

    app.use(express.json());
    app.use(logger);
    app.use(authenticateToken);

    const port = 3000;
    app.set('x-powered-by', false);

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });

    app.use('/', rootRouter);
    app.use(errorHandler);
};

startServer();
