import { Router } from 'express';

import user from './user.controller';
import group from './group.controller';
import authentication from './auth.controller';

const rootRouter = Router();

rootRouter.use('/users/', user);
rootRouter.use('/groups/', group);
rootRouter.use('/authentication/', authentication);

export default rootRouter;
