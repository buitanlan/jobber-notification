import { IEmailMessageDetails, winstonLogger } from '@tanlan/jobber-shared';
import { config } from '@notifications/config';
import { Application } from 'express';
import http from 'http';
import process from 'process';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';
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
  const emailChannel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);

  const verifyLink = `${config.CLIENT_URL}/confirm_email?v_token=123234whhghghghhghghgh`;

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: `${config.SENDER_EMAIL}`,
    verifyLink: verifyLink,
    username: 'Manny',
    template: 'verifyEmail',
  };
  await emailChannel.assertExchange('jobber-email-notification', 'direct');
  const message = JSON.stringify(messageDetails);
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message));
  // await emailChannel.assertExchange('jobber-order-notification', 'direct');
  // const message1 = JSON.stringify({name: 'jobber', service: 'order notification service'});
  // emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(message1));
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
