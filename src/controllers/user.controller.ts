import express, { NextFunction, Request, Response } from 'express';
import querySchema, { updateSchema, createSchema } from './user.validation';
import UserModel from '../models/user.model';
import UserService from '../services/user.service';
import UserDataMapperService from '../services/userDataMapper.service';

const validator = require('express-joi-validation').createValidator();

const router = express.Router();

const userServiceInstance = new UserService(UserModel, new UserDataMapperService());

router.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    userServiceInstance.getUser(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(204).end();
            }
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/users/', validator.query(querySchema), (req: Request, res: Response, next: NextFunction) => {
    const { limit, loginSubstring } = req.query;
    userServiceInstance.getUsers(loginSubstring, limit)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.put('/users/:id', validator.body(updateSchema), (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    userServiceInstance.updateUser(id, req.body)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    userServiceInstance.deleteUser(id).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(204).end();
        }
    }).catch((error) => {
        next(error);
    });
});

router.post('/users/', validator.body(createSchema), (req: Request, res: Response, next: NextFunction) => {
    userServiceInstance.createUser(req.body)
        .then((data) => {
            res.send(data);
        }).catch((error) => {
            next(error);
        });
});

export default router;
