import { winstonLogger } from '@buitanlan/jobber-shared';
import { config } from '@notification/config';
import { Application } from 'express';
import http from 'http';
import process from 'process';
import { healthRoutes } from '@notification/routes';
import { checkConnection } from '@notification/elasticsearch';
import { createConnection } from '@notification/queues/connection';
import { consumerAuthEmailMessages } from '@notification/queues/email.consumer';
import { Channel } from 'amqplib';

const SERVER_PORT = 4001;
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationService', 'debug');

export function start(app: Application) {
  startServer(app);
  app.use('', healthRoutes());
  void startQueues();
  void startElasticSearch();
}

async function startQueues() {
  const emailChannel = await createConnection() as Channel;
  await consumerAuthEmailMessages(emailChannel);
}

async function startElasticSearch() {
  await checkConnection();
}

function startServer(app: Application) {
  try {
    const httpServer = new http.Server(app);
    log.info(`worker on process id: ${process.pid} on notification service has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification service is running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.error('error', 'Notification service failed to start', error);
  }
}
