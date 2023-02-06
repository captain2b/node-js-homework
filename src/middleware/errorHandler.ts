import {NextFunction, Request, Response} from "express";

// Error handler should have 4 parameters
// eslint-disable-next-line no-unused-vars
const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Error: ', error);
    // Returning the status and error message to client
    res.status(500).send(error.message);
};

export default errorHandler;
