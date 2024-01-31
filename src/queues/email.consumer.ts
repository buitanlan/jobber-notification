import { winstonLogger } from '@buitanlan/jobber-shared';
import { config } from '@notification/config';
import { Channel } from 'amqplib';
import { createConnection } from '@notification/queues/connection';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

export async function consumerAuthEmailMessages(channel: Channel) {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }

    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    await channel.consume(jobberQueue.queue, async (msg) => {
      const message = JSON.parse(msg!.content.toString());
      log.info(`Email message received: ${JSON.stringify(message)}`);
      channel.ack(msg!)
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumerAuthEmailMessages() method:', error);
  }
}

export async function consumerOrderEmailMessages(channel: Channel) {
  try {
    if(!channel) {
      channel = await createConnection() as Channel ;
    }

    const exchangeName = 'jobber-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';

    await channel.assertExchange(exchangeName, 'direct') ;
    const jobberQueue = await channel.assertQueue(queueName, {durable: true, autoDelete: false});
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    await channel.consume(jobberQueue.queue, async (msg) => {
      const message = JSON.parse(msg!.content.toString());
      log.info(`Email message received: ${JSON.stringify(message)}`);
      channel.ack(msg!)
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumerAuthEmailMessages() method:', error);
  }
}
