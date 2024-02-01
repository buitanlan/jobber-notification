import { winstonLogger } from '@buitanlan/jobber-shared';
import { config } from '@notification/config';
import client, { Channel, Connection } from 'amqplib';
import process from 'process';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

export async function createConnection() {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully ...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'NotificationServer createConnection() method:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection) {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}
