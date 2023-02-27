import express, { Request, Response } from 'express';
import UserService from "../services/user.service";
import {User as UserModel} from "../models";
import UserDataMapperService from "../services/utils/userDataMapper.service";
const jwt = require('jsonwebtoken');

const router = express.Router();
const userServiceInstance = new UserService(UserModel, new UserDataMapperService());

router.post('/', async (req: Request, res: Response) => {
    const {login, password} = req.body;
    const user: any = await userServiceInstance.getUserByKey('Login', login);
    if (user && !user.isDeleted && password === user.password) {
        const payload = {sub: user.id};
        const token = jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: 100});
        res.send(token);
    }
    return res.status(401).send({message: 'Wrong login/password'});

});

export default router;
