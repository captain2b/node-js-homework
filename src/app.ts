import express from 'express';
import loaders from './loaders';
import rootRouter from './controllers';
import errorHandler from './middleware/errorHandler';
import logger from './middleware/logger';
import winstonLogger from './middleware/winstonLogger';
import authenticateToken from "./middleware/auth";

const cors = require('cors');
const app = express();

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
    app.use(cors()); // enable cors for all domain and all requests incl options

    loaders();

    app.use(express.json());
    app.use(logger);
    app.use(authenticateToken);

    app.set('x-powered-by', false);

    app.use('/', rootRouter);
    app.use(errorHandler);
};

startServer();
export default app;