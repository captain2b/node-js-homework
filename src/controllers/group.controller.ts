import express, { Request, Response } from 'express';
import GroupService from '../services/group.service';
import { Group as GroupModel } from '../models';
import GroupDataMapperService from '../services/utils/groupDataMapper.service';
import { createSchema, updateSchema } from './validation/group.validation';
import runAsyncWrapper from './utils';

const validator = require('express-joi-validation').createValidator();

const router = express.Router();

const groupServiceInstance = new GroupService(GroupModel, new GroupDataMapperService());

router.get('/', runAsyncWrapper(async (req: Request, res: Response) => {
    const groups = await groupServiceInstance.getGroups();
    res.send(groups);
}));

router.get('/:id', runAsyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const group = await groupServiceInstance.getGroup(id);
    if (group) {
        res.send(group);
    } else {
        res.status(204).end();
    }
}));

router.get('/:id/users', runAsyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const groupUsers = await groupServiceInstance.getGroupUsers(id);
    if (groupUsers) {
        res.send(groupUsers);
    } else {
        res.status(204).end();
    }
}));

router.post('/:id/users', runAsyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const groupUsers = await groupServiceInstance.addUsersToGroup(id, req.body.userIds);
    if (groupUsers) {
        res.send(groupUsers);
    } else {
        res.status(204).end();
    }
}));

router.post('/', validator.body(createSchema), runAsyncWrapper(async (req: Request, res: Response) => {
    const group = await groupServiceInstance.createGroup(req.body);
    res.send(group);
}));

router.delete('/:id', runAsyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedGroup = await groupServiceInstance.deleteGroup(id);
    if (deletedGroup) {
        res.send(deletedGroup);
    } else {
        res.status(204).end();
    }
}));

router.put('/:id', validator.body(updateSchema), runAsyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedGroup = await groupServiceInstance.updateGroup(id, req.body);
    res.send(updatedGroup);
}));

export default router;
