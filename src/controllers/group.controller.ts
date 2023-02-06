import express, { NextFunction, Request, Response } from 'express';
import GroupService from '../services/group.service';
import { Group as GroupModel } from '../models';
import GroupDataMapperService from '../services/groupDataMapper.service';
import { createSchema, updateSchema } from './validation/group.validation';

const validator = require('express-joi-validation').createValidator();

const router = express.Router();

const groupServiceInstance = new GroupService(GroupModel, new GroupDataMapperService());

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    groupServiceInstance.getGroups()
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    groupServiceInstance.getGroup(id)
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

router.get('/:id/users', (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    groupServiceInstance.getGroupUsers(id)
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

router.post('/:id/users', (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    groupServiceInstance.addUsersToGroup(id, req.body.userIds)
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

router.post('/', validator.body(createSchema), (req: Request, res: Response, next: NextFunction) => {
    groupServiceInstance.createGroup(req.body)
        .then((data) => {
            res.send(data);
        }).catch((error) => {
            next(error);
        });
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    groupServiceInstance.deleteGroup(id).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(204).end();
        }
    }).catch((error) => {
        next(error);
    });
});

router.put('/:id', validator.body(updateSchema), (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    groupServiceInstance.updateGroup(id, req.body)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            next(error);
        });
});

export default router;
