import app from './app';
import { logger } from './utils/logger';

app.listen(4000, () => logger.info('Server running on port 4000'));
