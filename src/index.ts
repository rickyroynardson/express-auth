import { Application } from 'express';
import { init } from './app';
import { logger } from './utils/logger';

const app: Application = init();

app.listen(4000, () => logger.info('Server running on port 4000'));
