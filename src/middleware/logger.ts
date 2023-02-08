import { NextFunction, Request, Response } from 'express';

// Error handler should have 4 parameters
// eslint-disable-next-line no-unused-vars
const logger = (req: Request, res: Response, next: NextFunction) => {
    const info = `
    Log level: info.\n
    Executing request.\n
    Path: ${req.path},\n
    Method: ${req.method},\n
    Body: ${JSON.stringify(req.body)},\n
    Timestamp: ${Date.now()},\n`;
    console.log(info);
    next();
};

export default logger;
