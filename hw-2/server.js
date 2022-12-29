import getAutoSuggestUsers from './utils';
import querySchema, { updateSchema, createSchema } from './validation';

const express = require('express');
const NodeCache = require('node-cache');
const uuid = require('uuid');
const validator = require('express-joi-validation').createValidator();

const cache = new NodeCache();
const app = express();
app.use(express.json());

const port = 3000;
const router = express.Router();

app.set('x-powered-by', false);
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  if (cache.has(id)) {
    res.send(cache.get(id));
  } else {
    res.send(`User with id: ${id} not found`);
  }
});
router.get('/users/', validator.query(querySchema), (req, res, next) => {
  try {
    // throw new Error('Test');
    const { limit, loginSubstring } = req.query;
    const data = Object.values(cache.mget(cache.keys()));
    const filtered = getAutoSuggestUsers(data, loginSubstring, limit);
    res.send(filtered);
  } catch (error) {
    next(error);
  }
});
router.put('/users/:id', validator.body(updateSchema), (req, res, next) => {
  try {
    // throw new Error('Test');
    const { id } = req.params;
    if (cache.has(id)) {
      const updated = {
        ...cache.get(id),
        ...req.body,
      };
      cache.set(id, updated);
      res.send(updated);
    } else {
      res.send(`User with id: ${id} not found`);
    }
  } catch (error) {
    next(error);
  }
});
router.delete('/users/:id', (req, res, next) => {
  try {
    // throw new Error('Test');
    const { id } = req.params;
    if (cache.has(id)) {
      const updated = {
        ...cache.get(id),
        isDeleted: true,
      };
      cache.set(id, updated);
      res.send(updated);
    } else {
      res.send(`User with id: ${id} not found`);
    }
  } catch (error) {
    next(error);
  }
});
router.post('/users/create', validator.body(createSchema), (req, res, next) => {
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
app.use((err, req, res, next) => {
  console.log('Error: ', err);
  res.status(500).json(err);
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use('/', router);
