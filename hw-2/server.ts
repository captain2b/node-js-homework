import autoSuggestUsersService, { User } from './autoSuggestUsersService';
import querySchema, { updateSchema, createSchema } from './validation';
import loaders from '../src/loaders';
import { NextFunction, Request, Response } from 'express';

const express = require('express');
const NodeCache = require('node-cache');
const uuid = require('uuid');
const validator = require('express-joi-validation').createValidator();

const cache = new NodeCache();
const app = express();

loaders();

app.use(express.json());

const port = 3000;
const router = express.Router();

app.set('x-powered-by', false);
router.get('/users/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    if (cache.has(id)) {
        res.send(cache.get(id));
    } else {
        res.status(204);
    }
});
router.get('/users/', validator.query(querySchema), (req: Request, res: Response, next: NextFunction) => {
    try {
    // throw new Error('Test');
        const { limit, loginSubstring } = req.query;
        const data: User[] = Object.values(cache.mget(cache.keys()));
        if ((loginSubstring && typeof loginSubstring !== 'string')
        || (limit && typeof limit !== 'string')
        ) {
            throw new Error('input type is not valid');
        }
        const filtered = autoSuggestUsersService(data, loginSubstring, limit);
        res.send(filtered);
    } catch (error) {
        next(error);
    }
});
router.put('/users/:id', validator.body(updateSchema), (req: Request, res: Response, next: NextFunction) => {
    try {
    // throw new Error('Test');
        const { id } = req.params;
        if (cache.has(id)) {
            const updated = {
                ...cache.get(id),
                ...req.body
            };
            cache.set(id, updated);
            res.send(updated);
        } else {
            res.status(204);
        }
    } catch (error) {
        next(error);
    }
});
router.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
    // throw new Error('Test');
        const { id } = req.params;
        if (cache.has(id)) {
            const updated = {
                ...cache.get(id),
                isDeleted: true
            };
            cache.set(id, updated);
            res.send(updated);
        } else {
            res.status(204);
        }
    } catch (error) {
        next(error);
    }
});
router.post('/users/', validator.body(createSchema), (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = uuid.v4();
        cache.set(id, { ...req.body, id });
        res.send(cache.keys());
    } catch (error) {
        next(error);
    }
});

// Error handler should have 4 parameters
// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Error: ', err);
    res.status(500).json(err);
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

app.use('/', router);
