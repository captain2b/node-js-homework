import { Router } from 'express';

import user from './user.controller';
import group from './group.controller';

const rootRouter = Router();

rootRouter.use('/users/', user);
rootRouter.use('/groups/', group);

export default rootRouter;
