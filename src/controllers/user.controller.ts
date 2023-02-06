import express, {Request, Response} from 'express';
import querySchema, {updateSchema, createSchema} from './validation/user.validation';
import {User as UserModel} from '../models';
import UserService from '../services/user.service';
import UserDataMapperService from '../services/userDataMapper.service';
import runAsyncWrapper from "./utils";

const validator = require('express-joi-validation').createValidator();

const router = express.Router();

const userServiceInstance = new UserService(UserModel, new UserDataMapperService());

router.get('/:id', runAsyncWrapper(async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = await userServiceInstance.getUser(id);
    if (user) {
        res.send(user);
    } else {
        res.status(204).end();
    }
}));

router.get('/', validator.query(querySchema), runAsyncWrapper(async (req: Request, res: Response) => {
    const {limit, loginSubstring} = req.query;
    const users = await userServiceInstance.getUsers(loginSubstring, limit);
    res.send(users);
}));

router.put('/:id', validator.body(updateSchema), runAsyncWrapper(async (req: Request, res: Response) => {
    const {id} = req.params;
    const updatedUser = userServiceInstance.updateUser(id, req.body);
    res.send(updatedUser);
}));

router.delete('/:id', runAsyncWrapper(async (req: Request, res: Response) => {
    const {id} = req.params;
    const deletedUser = await userServiceInstance.deleteUser(id);
    if (deletedUser) {
        res.send(deletedUser);
    } else {
        res.status(204).end();
    }
}));

router.post('/', validator.body(createSchema), runAsyncWrapper(async(req: Request, res: Response) => {
    const newUser = await userServiceInstance.createUser(req.body);
    res.send(newUser);
}));

export default router;
