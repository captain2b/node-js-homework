import {NextFunction, Request, Response} from "express";

const runAsyncWrapper = (callback: Function) => ((req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next)
            .catch(next)
    }
);

export default runAsyncWrapper;
