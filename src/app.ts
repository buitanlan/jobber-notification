import { winstonLogger } from '@tanlan/jobber-shared';
import { Logger } from 'winston';
import express, { Express } from 'express';
import { start } from '@notifications/server';
import { config } from '@notifications/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationApp', 'debug');

function initialize() {
  const app: Express = express();
  start(app);
  log.info('Notification Service Initialized');
}

initialize();
