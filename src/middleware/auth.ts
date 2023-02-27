import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');


const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'];
    if(req.path === '/authentication/') {
        return next();
    }

    if (!token) {
        return res.status(401).send({message: 'no token'});
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err: any) => {
        if (err) {
            return res.status(403).send({message: 'failed to authenticate token'})
        }
        return next();
    })
};

export default authenticateToken;

