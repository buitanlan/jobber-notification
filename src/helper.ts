import { IEmailLocals, winstonLogger } from '@buitanlan/jobber-shared';
import { config } from '@notification/config';
import nodemailer from 'nodemailer';
import Email from 'email-templates';
import path from 'path';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransporterHelper', 'debug');

export async function emailTemplate(template: string, receiver: string, locals: IEmailLocals) {
  try {
    const smtpTransport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });

    const email = new Email({
      message: {
        from: `Jobber App ${config.SENDER_EMAIL}`,
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs',
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build'),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, `..`, `/src/emails/`, template),
      message: {
        to: receiver,
      },
      locals,
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailTransport sendEmail() method:', error);
  }
}
