import { NextFunction, Request, Response } from 'express';

const runAsyncWrapper = (callback: Function) => (req: Request, res: Response, next: NextFunction) => {
    return callback(req, res, next)
        .catch(next);
}
;

export default runAsyncWrapper;
