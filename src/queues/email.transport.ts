import { IEmailLocals, winstonLogger } from '@buitanlan/jobber-shared';
import { config } from '@notification/config';
import { emailTemplate } from '@notification/helper';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailTransport', 'debug');


export async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals) {
  try {
    await emailTemplate( template, receiverEmail, locals );
    log.info('Sending email successfully');
  } catch (error) {
    log.log('error', 'NotificationService EmailTransport sendEmail() method:', error);
  }
}
