import { winstonLogger } from '@buitanlan/jobber-shared';
import { config } from '@notifications/config';
import { Client } from '@elastic/elasticsearch';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticsearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export async function checkConnection() {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health = await elasticSearchClient.cluster.health();
      isConnected = true;
      log.info(`NotificationService ElasticSearch health status - ${health.status}`);
    } catch (error) {
      log.error('Connect to ElasticSearch failed. Retrying...');
      log.log('error', 'NotificationService checkConnection() method:', error);
    }
  }
}
